import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { fetchStockData } from "@/fetchStockData";
import { RMI, RSI, MACD } from "@/utils/Indicators";
import { format } from "date-fns";
import { calculateRMIProfit } from "@/components/charts/RMIChart";
import { calculateRSIProfit } from "@/components/charts/RSIChart";
import { calculateMACDProfit } from "@/components/charts/MACD-Chart";
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

interface Notification {
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
];

const validKeys = ["RMI", "RSI"]; // Define valid keys for initial state

const NotificationBoard: React.FC = () => {
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(new Date());
	const [selectedPeriod, setSelectedPeriod] = useState<string>("1m");
	const [enabledIndicators, setEnabledIndicators] = useState<{
		[key: string]: boolean;
	}>(
		Object.fromEntries(
			indicators.map((ind) => [ind.key, validKeys.includes(ind.key)]) // Initialize enabledIndicators
		)
	);

	const toggleIndicator = (indicator: string) => {
		setEnabledIndicators((prev) => ({
			...prev,
			[indicator]: !prev[indicator],
		}));
	};

	useEffect(() => {
		const checkForSignals = async () => {
			const stocks = [
				"AAPL",
				"ABNB",
				"AMZN",
				"EBAY",
				"GOOGL",
				"META",
				"NFLX",
				"PLTR",
				"ZM",
			];
			const period = selectedPeriod;
			const newNotifications: Notification[] = [];
			const currentTime = new Date();

			try {
				const response = await fetchStockData(stocks.join(","), period, false);

				for (let symbol of stocks) {
					const history = response[symbol].history;
					const dates = Object.keys(history).map((date) => new Date(date));
					const closingPrices = dates
						.map((date) => history[format(date, "yyyy-MM-dd HH:mm:ss")]?.Close)
						.filter((price) => price !== undefined) as number[];

					for (const indicator of indicators) {
						if (enabledIndicators[indicator.key]) {
							const indicatorValues = indicator.calculate(closingPrices);
							const { buyPoints, sellPoints, latestBuyPrice, latestSellPrice } =
								indicator.calculateProfit(closingPrices, indicatorValues);

							if (latestBuyPrice !== null && buyPoints.length > 0) {
								const latestBuyPoint = buyPoints[buyPoints.length - 1];
								if (latestBuyPoint && typeof latestBuyPoint.x !== "undefined") {
									const buyTimestamp = dates[latestBuyPoint.x];
									newNotifications.push({
										id: `${symbol}-${indicator.key}-buy-${Date.now()}`,
										stock: symbol,
										indicator: indicator.key,
										signal: "buy",
										price: latestBuyPrice,
										timestamp: buyTimestamp,
										isNew: buyTimestamp > lastUpdateTime,
									});
								}
							} else if (latestSellPrice !== null && sellPoints.length > 0) {
								const latestSellPoint = sellPoints[sellPoints.length - 1];
								if (
									latestSellPoint &&
									typeof latestSellPoint.x !== "undefined"
								) {
									const sellTimestamp = dates[latestSellPoint.x];
									newNotifications.push({
										id: `${symbol}-${indicator.key}-sell-${Date.now()}`,
										stock: symbol,
										indicator: indicator.key,
										signal: "sell",
										price: latestSellPrice,
										timestamp: sellTimestamp,
										isNew: sellTimestamp > lastUpdateTime,
									});
								}
							}
						}
					}
				}

				// Sort notifications by timestamp
				const sortedNotifications = newNotifications.sort(
					(a, b) => b.timestamp.getTime() - a.timestamp.getTime()
				);

				setNotifications(sortedNotifications);
				setLastUpdateTime(currentTime);
			} catch (error) {
				console.error("Error fetching stock data:", error);
			}
		};

		checkForSignals();
		const intervalId = setInterval(checkForSignals, 60000);

		return () => clearInterval(intervalId);
	}, [selectedPeriod, enabledIndicators, lastUpdateTime]);

	return (
		<Card className="mt-4">
			<CardHeader className="flex flex-wrap justify-between items-center">
				<CardTitle>Real-time Notifications</CardTitle>
				<div className="flex gap-2">
					<Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
						<SelectTrigger className="min-w-[120px]">
							<SelectValue placeholder="1 Month" />
						</SelectTrigger>
						<SelectContent>
							{periodOptions.map(({ value, label }) => (
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
									/>
									<label htmlFor={key}>{label}</label>
								</div>
							))}
						</PopoverContent>
					</Popover>
				</div>
				{lastUpdateTime && (
					<div className="text-sm text-gray-500">
						Last updated: {lastUpdateTime?.toLocaleTimeString()}
					</div>
				)}
			</CardHeader>
			<ScrollArea className="h-[300px] mt-2">
				<CardContent>
					{notifications.length === 0 ? (
						<p>No new signals</p>
					) : (
						<ul>
							{notifications.map((notification) => (
								<li
									key={notification.id}
									className={`mb-2 p-2 rounded ${
										notification.isNew ? "bg-green-100 border" : "bg-gray-100"
									}`}
								>
									<span className="font-bold">{notification.stock}</span>{" "}
									{notification.indicator} gives a{" "}
									<span
										className={
											notification.signal === "buy"
												? "text-green-500"
												: "text-red-500"
										}
									>
										{notification.signal}
									</span>{" "}
									signal at ${notification.price.toFixed(2)}
									<span className="text-sm text-gray-500 ml-2">
										{notification.timestamp.toLocaleDateString()}
									</span>
								</li>
							))}
						</ul>
					)}
				</CardContent>
			</ScrollArea>
		</Card>
	);
};

export default NotificationBoard;