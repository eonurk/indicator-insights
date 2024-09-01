import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import { RMI, RSI, SMA, EMA, MACD, BollingerBands } from "@/utils/Indicators";
import {
	calculateRMIProfit,
	calculateRSIProfit,
	calculateSMAProfit,
	calculateEMAProfit,
	calculateMACDProfit,
	calculateBollingerBandsProfit,
} from "@/utils/calculateProfit";

import { stocks } from "@/utils/stocks";
import { fetchStockData } from "@/fetchStockData";
import { User } from "firebase/auth";

const periodOptions = [
	{ value: "1d", label: "1 Day" },
	{ value: "1w", label: "1 Week" },
	{ value: "1m", label: "1 Month" },
	{ value: "3m", label: "3 Months" },
	{ value: "ytd", label: "Year to Date" },
	{ value: "1y", label: "1 Year" },
	{ value: "all", label: "All" },
];

interface SignalData {
	profit: number;
	buyPoints: { x: number; y: number; price: number }[];
	sellPoints: { x: number; y: number; price: number }[];
	latestBuyPrice: number | null;
	latestSellPrice: number | null;
}

interface StockChartProps {
	user: User | null; // Use User type from firebase/auth
}

interface Result {
	symbol: string;
	indicatorResult: number[];
	lastSignal: SignalData; // Update this line
	closingPrices: number[];
}

export default function IndicatorChecker({ user }: StockChartProps) {
	const [buttonDisable, setButtonDisable] = useState(false);
	const [period, setPeriod] = useState<string>("1w");
	const [indicator, setIndicator] = useState<string>("RMI");
	const [results, setResults] = useState<Result[]>([]);

	const handleStart = async () => {
		try {
			setButtonDisable(true);

			const availableStocks = user
				? stocks
				: {
						AAPL: "Apple Inc.",
						ABNB: "Airbnb, Inc.",
						AMZN: "Amazon.com, Inc.",
						EBAY: "eBay Inc.",
						GOOGL: "Alphabet Inc. (Class A)",
						META: "Meta Platforms, Inc.",
						NFLX: "Netflix, Inc.",
						PLTR: "Palantir Technologies Inc.",
						ZM: "Zoom Video Communications, Inc.",
				  };

			const symbols = Object.keys(availableStocks);

			const response = await fetchStockData(symbols.join(","), period, false, [
				"Close",
			]);
			const indicatorResults = [];

			for (const symbol of symbols) {
				const history = response[symbol].history;
				const dates = Object.keys(history).map((date) => new Date(date));
				const closingPrices = dates
					.map((date) => history[format(date, "yyyy-MM-dd HH:mm:ss")]?.Close)
					.filter((price) => price !== undefined) as number[];

				let indicatorResult: number[] = [];
				let signalData: SignalData | undefined = undefined; // Update this line

				switch (indicator) {
					case "RMI":
						indicatorResult = RMI(closingPrices, 14);
						signalData = calculateRMIProfit(closingPrices, indicatorResult);
						break;
					case "RSI":
						indicatorResult = RSI(closingPrices, 14);
						signalData = calculateRSIProfit(
							closingPrices,
							indicatorResult
						) as SignalData;
						break;
					case "SMA":
						indicatorResult = SMA(closingPrices, 14);
						signalData = calculateSMAProfit(
							closingPrices,
							indicatorResult
						) as SignalData;
						break;
					case "EMA":
						indicatorResult = EMA(closingPrices, 14);
						signalData = calculateEMAProfit(
							closingPrices,
							indicatorResult
						) as SignalData;
						break;
					case "MACD": {
						const macdResult = MACD(closingPrices, 12, 26, 9);
						signalData = calculateMACDProfit(
							closingPrices,
							macdResult.macdLine,
							macdResult.signalLine
						) as SignalData;
						break;
					}
					case "BollingerBands": {
						const bbResult = BollingerBands(closingPrices, 20, 2);
						signalData = calculateBollingerBandsProfit(
							closingPrices,
							bbResult.map((band) => band.upper) as number[],
							bbResult.map((band) => band.lower) as number[]
						) as SignalData;
						break;
					}
				}

				indicatorResults.push({
					symbol,
					indicatorResult,
					lastSignal: signalData as SignalData, // Update this line
					closingPrices,
				});
			}

			setResults(indicatorResults as Result[]);
		} catch (error) {
			console.error("Error fetching stock data:", error);
		} finally {
			setButtonDisable(false);
		}
	};

	return (
		<>
			<Card className="w-full md:w-2/3 md:mx-auto">
				<CardHeader>
					<CardTitle>Backtest Indicator</CardTitle>
					<CardDescription>
						Check the value proposition of an indicator across all stocks with
						one-click.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form>
						<div className="grid items-center gap-4">
							<div className="flex flex-col space-y-1.5">
								<Label htmlFor="indicator">Indicator</Label>
								<Select value={indicator} onValueChange={setIndicator}>
									<SelectTrigger id="indicator">
										<SelectValue placeholder="Select" />
									</SelectTrigger>
									<SelectContent position="popper">
										<SelectItem value="RMI">RMI</SelectItem>
										<SelectItem value="RSI">RSI</SelectItem>
										<SelectItem value="SMA">SMA</SelectItem>
										<SelectItem value="EMA">EMA</SelectItem>
										<SelectItem value="MACD">MACD</SelectItem>
										<SelectItem value="BollingerBands">
											Bollinger Bands
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<Select value={period} onValueChange={setPeriod}>
								<SelectTrigger>
									<SelectValue placeholder="1w" />
								</SelectTrigger>
								<SelectContent position="popper">
									{periodOptions.map((option) => (
										<SelectItem key={option.value} value={option.value}>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</form>
				</CardContent>
				<CardFooter className="flex justify-between">
					<Button
						className={`
							w-full flex-1 relative overflow-hidden
							transition-all duration-300 ease-in-out
							bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700
							${
								!user && !buttonDisable
									? "bg-[length:200%_100%] animate-[gradient_3s_ease-in-out_infinite]"
									: ""
							}
							${buttonDisable ? "opacity-50" : "hover:shadow-lg hover:brightness-110"}
						`}
						onClick={handleStart}
						disabled={buttonDisable}
					>
						{buttonDisable && (
							<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
						)}
						<span className={!user && !buttonDisable ? "animate-pulse" : ""}>
							Start
						</span>
					</Button>
				</CardFooter>
			</Card>
			{results.length > 0 && (
				<Card className="mt-4 w-full md:w-2/3 md:mx-auto">
					<CardContent className="p-2">
						<ScrollArea className="h-[250px] mt-2">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className="text-center p-1 pl-2">
											Stock Symbol
										</TableHead>
										<TableHead className="text-center p-1">
											Last Signal
										</TableHead>
										<TableHead className="text-center p-1">
											Signal Price
										</TableHead>
										<TableHead className="text-center p-1">
											Current Price
										</TableHead>
										<TableHead className="text-center p-1">
											Indicator Profit
										</TableHead>
									</TableRow>
								</TableHeader>

								<TableBody>
									{results.map((result) => (
										<TableRow
											key={result.symbol}
											className={
												result.lastSignal.latestBuyPrice !== null
													? "text-green-500"
													: "text-red-500"
											}
										>
											<TableCell className="p-1">{result.symbol}</TableCell>
											<TableCell className="p-1">
												{result.lastSignal.latestBuyPrice !== null
													? "Buy"
													: "Sell"}
											</TableCell>
											<TableCell className="p-1">
												{result.lastSignal.latestBuyPrice !== null
													? result.lastSignal.latestBuyPrice.toFixed(2)
													: result.lastSignal.latestSellPrice !== undefined &&
													  result.lastSignal.latestSellPrice !== null
													? result.lastSignal.latestSellPrice.toFixed(2)
													: "-"}
											</TableCell>
											<TableCell className="p-1">
												{result.closingPrices[
													result.closingPrices.length - 1
												].toFixed(2)}
											</TableCell>
											<TableCell
												className={
													result.lastSignal.profit > 0
														? "text-green-500 p-1"
														: "text-red-500 p-1"
												}
											>
												{result.lastSignal.profit.toFixed(2)}%
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</ScrollArea>
					</CardContent>
				</Card>
			)}
		</>
	);
}
