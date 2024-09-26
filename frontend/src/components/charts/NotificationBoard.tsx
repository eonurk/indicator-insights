import React, {
	useState,
	useEffect,
	useCallback,
	useRef,
	useMemo,
} from "react";
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardDescription,
} from "@/components/ui/card";
import { fetchStockData } from "@/fetchStockData";
import {
	RMI,
	RSI,
	MACD,
	// StochRSI,
	// EMA,
	// BollingerBands,
} from "@/utils/Indicators";
import { format } from "date-fns";
import {
	calculateRMIProfit,
	calculateMACDProfit,
	calculateRSIProfit,
	// calculateStochRSIProfit,
	// calculateEMAProfit,
	// calculateBollingerBandsProfit,
} from "@/utils/calculateProfit";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { exportNotificationsToCSV } from "@/utils/saveExcel";
import { DownloadIcon } from "lucide-react";

export interface Notification {
	id: string;
	stock: string;
	indicator: string;
	signal: "buy" | "sell";
	price: number;
	timestamp: Date;
	isNew: boolean;
}

const periodOptions = [
	{ value: "1d", label: "1 Day" },
	{ value: "1w", label: "1 Week" },
	{ value: "1m", label: "1 Month" },
	{ value: "3m", label: "3 Months" },
	{ value: "ytd", label: "Year to Date" },
	{ value: "1y", label: "1 Year" },
	{ value: "all", label: "All" },
];

const indicators = [
	{
		key: "RMI",
		label: "RMI",
		calculate: RMI,
		calculateProfit: calculateRMIProfit,
	},
	{
		key: "RSI",
		label: "RSI",
		calculate: RSI,
		calculateProfit: calculateRSIProfit,
	},
	{
		key: "MACD",
		label: "MACD",
		calculate: MACD,
		calculateProfit: calculateMACDProfit,
	},
	// {
	// 	key: "BollingerBands",
	// 	label: "Bollinger Bands",
	// 	calculate: BollingerBands,
	// 	calculateProfit: calculateBollingerBandsProfit,
	// },
	// {
	// 	key: "StochRSI",
	// 	label: "Stochastic RSI",
	// 	calculate: StochRSI,
	// 	calculateProfit: calculateStochRSIProfit,
	// },
	// {
	// 	key: "EMA",
	// 	label: "EMA",
	// 	calculate: EMA,
	// 	calculateProfit: calculateEMAProfit,
	// },
];

interface StockData {
	[key: string]: unknown;
	symbol: string;
	history: StockHistory;
}

interface StockHistory {
	[date: string]: {
		Close: number;
		Open: number;
		High: number;
		Low: number;
		Volume: number;
	};
}

interface NotificationBoardProps {
	availableStocks: { [key: string]: string };
	onNotificationClick: (
		stock: string,
		period: string,
		indicator: string
	) => void;
}

const NotificationBoard: React.FC<NotificationBoardProps> = ({
	onNotificationClick,
	availableStocks,
}) => {
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(new Date());
	const [selectedPeriod, setSelectedPeriod] = useState<string>("1m");
	const [enabledIndicators, setEnabledIndicators] = useState<{
		[key: string]: boolean;
	}>(Object.fromEntries(indicators.map((ind) => [ind.key, ind.key == "RMI"])));
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const cachedDataRef = useRef<{
		[key: string]: StockData;
	}>({});
	const lastFetchTimeRef = useRef<{
		time: Date;
		period: string;
		enabledIndicators: { [key: string]: boolean };
		availableStocks: { [key: string]: string };
	} | null>(null);

	const toggleIndicator = (indicator: string) => {
		setEnabledIndicators((prev) => ({
			...prev,
			[indicator]: !prev[indicator],
		}));
	};

	const handleNotificationClick = (notification: Notification) => {
		onNotificationClick(
			notification.stock,
			selectedPeriod,
			notification.indicator
		);
	};

	const shouldFetchNewData = useMemo(() => {
		const currentTime = new Date();
		return (
			!lastFetchTimeRef.current ||
			currentTime.getTime() - lastFetchTimeRef.current.time.getTime() >
				5 * 60 * 1000 ||
			selectedPeriod !== lastFetchTimeRef.current?.period ||
			JSON.stringify(enabledIndicators) !==
				JSON.stringify(lastFetchTimeRef.current?.enabledIndicators) ||
			JSON.stringify(availableStocks) !==
				JSON.stringify(lastFetchTimeRef.current?.availableStocks)
		);
	}, [selectedPeriod, enabledIndicators, availableStocks]);

	const checkForSignals = useCallback(async () => {
		setError(null);
		const symbols = Object.keys(availableStocks);

		if (symbols.length === 0) {
			setNotifications([]);
			setIsLoading(false);
			return;
		}

		const newNotifications: Notification[] = [];
		const currentTime = new Date();

		try {
			let response;
			if (shouldFetchNewData) {
				setIsLoading(true);
				response = (await fetchStockData(
					symbols.join(","),
					selectedPeriod,
					false,
					["Close"]
				)) as Record<string, StockData>;
				cachedDataRef.current = response as Record<string, StockData>;
				lastFetchTimeRef.current = {
					time: currentTime,
					period: selectedPeriod,
					enabledIndicators: { ...enabledIndicators },
					availableStocks: { ...availableStocks },
				};
				setIsLoading(false);
			} else {
				response = cachedDataRef.current;
			}

			for (const symbol of symbols) {
				if (!response[symbol] || !response[symbol].history) {
					continue;
				}
				const history = response[symbol].history;
				const dates = Object.keys(history).map((date) => new Date(date));
				const closingPrices = dates
					.map((date) => {
						const formattedDate = format(date, "yyyy-MM-dd HH:mm:ss");
						return history[formattedDate]?.Close;
					})
					.filter((price) => price !== undefined) as number[];

				// Process indicators and generate notifications
				for (const indicator of indicators) {
					if (enabledIndicators[indicator.key]) {
						let indicatorValues:
							| number[]
							| {
									macdLine: number[];
									signalLine: number[];
									histogram: number[];
							  };
						let macdLine: number[] = [],
							signalLine: number[] = [];

						if (indicator.key === "MACD") {
							const macdResult = indicator.calculate(closingPrices) as {
								macdLine: number[];
								signalLine: number[];
								histogram: number[];
							};
							indicatorValues = macdResult;
							macdLine = macdResult.macdLine;
							signalLine = macdResult.signalLine;
						} else {
							indicatorValues = indicator.calculate(closingPrices) as number[];
						}

						const { buyPoints, sellPoints, latestBuyPrice, latestSellPrice } =
							indicator.key === "MACD"
								? indicator.calculateProfit(closingPrices, macdLine, signalLine)
								: indicator.calculateProfit(
										closingPrices,
										indicatorValues as number[],
										dates.map((date) => date.getTime())
								  );

						const addNotification = (
							signal: "buy" | "sell",
							price: number,
							timestamp: Date
						) => {
							newNotifications.push({
								id: `${symbol}-${indicator.key}-${signal}-${Date.now()}`,
								stock: symbol,
								indicator: indicator.key,
								signal,
								price,
								timestamp,
								isNew: timestamp > (lastUpdateTime || new Date(0)),
							});
						};

						if (latestBuyPrice !== null && buyPoints.length > 0) {
							const latestBuyPoint = buyPoints[buyPoints.length - 1];
							if (latestBuyPoint && typeof latestBuyPoint.x !== "undefined") {
								addNotification("buy", latestBuyPrice, dates[latestBuyPoint.x]);
							}
						} else if (latestSellPrice !== null && sellPoints.length > 0) {
							const latestSellPoint = sellPoints[sellPoints.length - 1];
							if (latestSellPoint && typeof latestSellPoint.x !== "undefined") {
								addNotification(
									"sell",
									latestSellPrice,
									dates[latestSellPoint.x]
								);
							}
						}
					}
				}
			}

			setNotifications(
				newNotifications.sort(
					(a, b) => b.timestamp.getTime() - a.timestamp.getTime()
				)
			);
			setLastUpdateTime(currentTime);
			setError(null); // Clear error after successful fetch
		} catch (error) {
			console.error("Error in checkForSignals:", error);
			setIsLoading(false);
			if (error instanceof Error) {
				setError(`Failed to fetch stock data: ${error.message}`);
			} else {
				setError("An unexpected error occurred while fetching stock data.");
			}
		}
	}, [availableStocks, selectedPeriod, enabledIndicators, shouldFetchNewData]);

	useEffect(() => {
		checkForSignals();
	}, [checkForSignals]);

	useEffect(() => {
		const intervalId = setInterval(checkForSignals, 5 * 60 * 1000);
		return () => clearInterval(intervalId);
	}, [checkForSignals]);

	return (
		<Card className="w-full md:w-2/3 md:mx-auto">
			<CardHeader className="flex flex-wrap justify-between items-center">
				<div className="flex items-center ml-3">
					<CardTitle>Real-time Insights</CardTitle>
					<a
						className="ml-2 cursor-pointer"
						onClick={() => exportNotificationsToCSV(notifications)}
					>
						<DownloadIcon className="w-5 h-5 cursor-pointer" />
					</a>
				</div>

				<CardDescription>
					Real-time buy/sell signals for portfolio stocks based on selected
					period and indicators.
				</CardDescription>
				{lastUpdateTime && (
					<div className="flex items-center justify-center text-sm text-gray-500">
						<span className="bg-green-500 h-3 w-3 rounded-full animate-pulse"></span>
						<span className="ml-2">
							Last updated: {format(lastUpdateTime, "yyyy-MM-dd HH:mm")}
						</span>
					</div>
				)}
				<div className="flex gap-2">
					<Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
						{/* Button that opens the dropdown */}
						<SelectTrigger className="min-w-[120px]">
							{/* Displays the currently selected value */}
							<SelectValue />
						</SelectTrigger>

						{/* Container for the dropdown items */}
						<SelectContent>
							{/* Map over periodOptions to create a list of selectable items */}
							{periodOptions.map(({ value, label }) => (
								// Each item represents a selectable period option
								<SelectItem key={value} value={value}>
									{label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Popover>
						<PopoverTrigger asChild>
							<Button variant="outline">Select Indicators</Button>
						</PopoverTrigger>
						<PopoverContent className="w-56">
							{indicators.map(({ key, label }) => (
								<div key={key} className="flex items-center space-x-2">
									<Checkbox
										id={key}
										checked={enabledIndicators[key]}
										onCheckedChange={() => toggleIndicator(key)}
										className="w-5 h-5 m-1" // Add this line to increase the size
									/>
									<label htmlFor={key}>{label}</label>
								</div>
							))}
						</PopoverContent>
					</Popover>
				</div>
			</CardHeader>
			<ScrollArea className="h-[400px] mt-2">
				<CardContent>
					{error && (
						<Alert variant="default" className="mb-4">
							<AlertDescription className="animate-pulse text-green-500">
								Please wait while we fetch the data...
							</AlertDescription>
						</Alert>
					)}
					{isLoading ? (
						<Alert variant="default" className="mb-4">
							<AlertDescription className="animate-pulse text-green-500">
								Loading...
							</AlertDescription>
						</Alert>
					) : (
						<>
							<ul>
								{notifications.map((notification) => (
									<li
										key={notification.id}
										className={`mb-2 p-4 rounded-lg shadow-md transition-transform transform ${
											notification.isNew ? "bg-green-100 border" : "bg-gray-100"
										} cursor-pointer hover:bg-opacity-80 hover:scale-105`}
										onClick={() => handleNotificationClick(notification)}
									>
										<div className="flex items-center justify-between">
											<span className="font-bold text-lg">
												{notification.stock}
											</span>
											<span
												className={`text-lg font-base ${
													notification.signal === "buy"
														? "text-green-500"
														: "text-red-500"
												}`}
											>
												{notification.signal.toUpperCase()}
											</span>
										</div>
										<div className="flex items-center justify-between mt-2">
											<span className="text-sm text-gray-500">
												{notification.indicator} signal at $
												{notification.price.toFixed(2)}
											</span>
											<span className="text-sm text-gray-500">
												{format(notification.timestamp, "yyyy-MM-dd HH:mm")}
											</span>
										</div>
									</li>
								))}
							</ul>
						</>
					)}
				</CardContent>
			</ScrollArea>
		</Card>
	);
};

export default NotificationBoard;
