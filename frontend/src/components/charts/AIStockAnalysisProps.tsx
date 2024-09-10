import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { User } from "firebase/auth";
import { toast } from "@/components/ui/use-toast";
import { Link, useNavigate } from "react-router-dom";

import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardDescription,
	CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Copy } from "lucide-react";
import { fetchStockData, fetchSummary } from "@/fetchStockData";
import { RMI, RSI, MACD, SMA, EMA } from "@/utils/Indicators";
import { format } from "date-fns";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "../ui/separator";
import { Icons } from "../icons";

interface StockHistory {
	[date: string]: {
		Close: number;
		Open: number;
		High: number;
		Low: number;
		Volume: number;
	};
}

interface StockData {
	[key: string]: unknown;
	symbol: string;
	history: StockHistory;
}

interface AIStockAnalysisProps {
	selectedStock: string;
	selectedPeriod: string;
	availableStocks: Record<string, string>;
	user: User | null;
}

const AIStockAnalysis: React.FC<AIStockAnalysisProps> = ({
	user,
	selectedStock,
	selectedPeriod,
	availableStocks,
}) => {
	const [summary, setSummary] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [hasUsedFreeTry, setHasUsedFreeTry] = useState<boolean>(false);
	const [dailyLimit, setDailyLimit] = useState<number>(0);
	const navigate = useNavigate();

	const [stockSymbol, setStockSymbol] = useState(selectedStock);
	const [period, setPeriod] = useState(selectedPeriod);
	const [visibleChars, setVisibleChars] = useState(0);
	const textRef = useRef<HTMLDivElement>(null);
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		const freeTryUsed = localStorage.getItem("freeTryUsed");
		if (freeTryUsed === "true") {
			setHasUsedFreeTry(true);
		}

		const currentDate = getCurrentDate();
		const dailyLimitKey = `dailyLimit_${currentDate}`;
		const dailyLimit = parseInt(localStorage.getItem(dailyLimitKey) || "0", 10);
		setDailyLimit(dailyLimit);
	}, []);

	useEffect(() => {
		setStockSymbol(stockSymbol);
		setPeriod(period);
	}, [stockSymbol, period]);

	useEffect(() => {
		if (summary) {
			let charIndex = 0;
			const intervalId = setInterval(() => {
				if (charIndex < summary.length) {
					setVisibleChars(charIndex + 2);
					setProgress(((charIndex + 2) / summary.length) * 100);
					charIndex += 2;
				} else {
					clearInterval(intervalId);
					setProgress(100);
				}
			}, 10);

			return () => clearInterval(intervalId);
		}
	}, [summary]);

	const getCurrentDate = () => {
		const today = new Date();
		return today.toISOString().split("T")[0];
	};

	const generateSummary = async () => {
		if (!user && hasUsedFreeTry) {
			navigate("/subscribe");
			return;
		}

		const currentDate = getCurrentDate();
		const dailyLimitKey = `dailyLimit_${currentDate}`;
		const dailyLimit = parseInt(localStorage.getItem(dailyLimitKey) || "0", 10);

		if (user && dailyLimit >= 10) {
			setSummary(
				"Daily limit of 10 analyses reached. Please try again tomorrow."
			);
			return;
		}

		setIsLoading(true);
		try {
			// Fetch the latest stock data
			const stockData: Record<string, StockData> = (await fetchStockData(
				stockSymbol,
				period,
				false,
				["Close"]
			)) as Record<string, StockData>;

			if (!stockData[stockSymbol]) {
				throw new Error(`No data found for ${stockSymbol}`);
			}

			const history = stockData[stockSymbol].history;
			const dates = Object.keys(history).map((date) => new Date(date));
			const closingPrices = dates
				.map((date) => history[format(date, "yyyy-MM-dd HH:mm:ss")]?.Close)
				.filter((price) => price !== undefined) as number[];

			// Calculate indicators
			const rmi = RMI(closingPrices, 14);
			const rsi = RSI(closingPrices, 14);
			const macd = MACD(closingPrices);
			const sma50 = SMA(closingPrices, 50);
			const ema20 = EMA(closingPrices, 20);

			// Prepare the stock information for analysis
			const stockInfo = `
Stock Symbol: ${stockSymbol}
Latest Price: $${closingPrices[closingPrices.length - 1].toFixed(2)}
RMI (14): ${rmi[rmi.length - 1].toFixed(2)}
RSI (14): ${rsi[rsi.length - 1].toFixed(2)}
MACD: ${macd.macdLine[macd.macdLine.length - 1].toFixed(2)}
MACD Signal: ${macd.signalLine[macd.signalLine.length - 1].toFixed(2)}
SMA (50): ${sma50[sma50.length - 1].toFixed(2)}
EMA (20): ${ema20[ema20.length - 1].toFixed(2)}

Please provide a structured summary with the following sections:
1. Stock Information Summary
2. Analysis
3. Future Outlook`;
			// Call the backend API
			const response = await fetchSummary(stockInfo);

			setSummary(response);
			if (!user) {
				setHasUsedFreeTry(true);
				localStorage.setItem("freeTryUsed", "true");
			} else {
				localStorage.setItem(dailyLimitKey, (dailyLimit + 1).toString());
				setDailyLimit(dailyLimit + 1);
			}
		} catch (error) {
			console.error("Error generating summary:", error);
			setSummary("Failed to generate summary. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const copyToClipboard = () => {
		navigator.clipboard.writeText(summary).then(() => {
			toast({
				title: "Copied!",
				description: "Summary copied to clipboard",
			});
		});
	};

	const shareOnTwitter = () => {
		const tweetText = encodeURIComponent(
			`Check out this AI-generated stock analysis for ${stockSymbol}:\n\n${summary}
			\n\nCreated with ❤️ by indicatorinsights.co`
		);
		window.open(`https://x.com/intent/tweet?text=${tweetText}`, "_blank");
	};

	const shareOnTelegram = () => {
		const text = encodeURIComponent(
			`AI Stock Analysis for ${stockSymbol}:\n\n${summary}
            \n\nCreated with ❤️ by indicatorinsights.co`
		);
		window.open(`https://t.me/share/url?url=${text}`, "_blank");
	};

	return (
		<Card
			className="
			mt-4 w-full md:w-2/3 md:mx-auto p-2 md:p-4 
			items-center bg-gradient-to-r shadow-xl rounded-xl
		from-indigo-500 via-purple-500 to-pink-500"
		>
			<CardHeader className="items-center">
				<CardTitle className="tracking-wide  mt-4 text-3xl font-bold text-white">
					AI Stock Insights
				</CardTitle>
				<CardDescription className="text-white">
					Leverage artificial intelligence to gain insights into stock market
				</CardDescription>
			</CardHeader>
			<CardContent className="mt-4 w-full px-0">
				<Select value={stockSymbol} onValueChange={setStockSymbol}>
					<SelectTrigger
						className="bg-white text-indigo-600 mt-2 max-w-[250px] mx-auto text-sm"
						aria-label="Select a value"
					>
						<SelectValue placeholder="AAPL" />
					</SelectTrigger>
					<SelectContent position="popper">
						{Object.entries(availableStocks).map(([id, name]) => (
							<SelectItem key={id} value={id}>
								{name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Select value={period} onValueChange={setPeriod}>
					<SelectTrigger className="bg-white text-indigo-600 mt-2 mb-8 max-w-[250px] mx-auto text-sm">
						<SelectValue placeholder="Select a period" />
					</SelectTrigger>
					<SelectContent position="popper">
						<SelectItem value="1d">1 Day</SelectItem>
						<SelectItem value="1w">1 Week</SelectItem>
						<SelectItem value="1m">1 Month</SelectItem>
						<SelectItem value="3m">3 Months</SelectItem>
						<SelectItem value="1y">1 Year</SelectItem>
						<SelectItem value="all">All Time</SelectItem>
					</SelectContent>
				</Select>

				{user && (
					<p className="text-white text-center my-4">
						Daily Limit: {10 - dailyLimit} analyses remaining
					</p>
				)}

				{!user && hasUsedFreeTry ? (
					<Link to="/subscribe">
						<Button
							className="transition-all duration-300 hover:scale-105 bg-white 
						text-indigo-600 text-base py-6 px-8 rounded-full shadow-lg hover:text-white "
						>
							<p className="animate-pulse">Get Started</p>
						</Button>
					</Link>
				) : (
					<Button
						onClick={() => generateSummary()}
						disabled={isLoading}
						className={`transition-all duration-300 ${
							isLoading ? "scale-95" : "scale-100"
						} hover:scale-105 bg-white text-indigo-600 font-bold py-6 text-base px-8 rounded-full shadow-lg`}
					>
						{isLoading ? (
							<div className="items-center space-x-2 flex">
								<Loader2 className="mr-2 h-6 w-6 animate-spin text-indigo-600" />
								<span className="animate-pulse text-indigo-600">Analyzing</span>
							</div>
						) : (
							<span className="text-indigo-600 text-base">
								{!user && hasUsedFreeTry ? "Analyze More" : "Analyze Stock"}
							</span>
						)}
					</Button>
				)}
				{summary && (
					<div className="mt-8 bg-white p-8 rounded-lg shadow-lg w-full">
						<h3 className="text-lg font-semibold mb-4 text-indigo-600">
							{stockSymbol} - {period}
						</h3>
						<div
							className="transition-all duration-500 ease-in-out rounded-full mt-4"
							style={{
								width: `${progress}%`,
								height: "10px",
								backgroundColor: "#4F46E5",
							}}
						/>
						<Separator className="my-2" />
						<div className="text-gray-800 text-sm text-justify overflow-hidden relative">
							<div ref={textRef}>
								<ReactMarkdown
									components={{
										strong: ({ ...props }) => (
											<span className="font-bold text-indigo-600" {...props} />
										),
									}}
								>
									{summary.slice(0, visibleChars)}
								</ReactMarkdown>
							</div>
						</div>
						<div className="mt-4 flex justify-center space-x-2 items-center ">
							<Button onClick={copyToClipboard} variant="ghost" size="sm">
								<Copy className="w-4 h-4 mr-2" />
							</Button>
							<Button onClick={shareOnTwitter} variant="ghost" size="sm">
								<Icons.twitter className="w-4 h-4 mr-2" />
							</Button>

							<Button onClick={shareOnTelegram} variant="ghost" size="sm">
								<Icons.telegram className="w-4 h-4 mr-2" />
							</Button>
						</div>
					</div>
				)}

				{!user && !hasUsedFreeTry && (
					<p className="text-white text-center mt-8 text-base">
						You have 1 complimentary analysis available. Sign up for unlimited
						access to our premium features.
					</p>
				)}
				{!user && hasUsedFreeTry && (
					<p className="text-white text-center mt-8 text-lg">
						Unlock AI-powered stock analyses by signing up today!
					</p>
				)}
			</CardContent>
			<CardFooter className="text-xs items-center justify-center text-white text-center">
				<p className="text-center max-w-sm">
					AI models may not always be accurate. Always conduct your own research
					before making investment decisions.
				</p>
			</CardFooter>
		</Card>
	);
};

export default AIStockAnalysis;
