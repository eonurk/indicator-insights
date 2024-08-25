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
import { stocks } from "@/utils/stocks";
import { User } from "firebase/auth";
import { Skeleton } from "@/components/ui/skeleton";

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

interface NotificationBoardProps {
	user: User | null;
}

const NotificationBoard: React.FC<NotificationBoardProps> = ({ user }) => {
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(new Date());
	const [selectedPeriod, setSelectedPeriod] = useState<string>("1w");
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
			const period = selectedPeriod;
			const newNotifications: Notification[] = [];
			const currentTime = new Date();

			try {
				const response = await fetchStockData(symbols.join(","), period, false);

				for (let symbol of symbols) {
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
										isNew: buyTimestamp > (lastUpdateTime || new Date(0)),
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
										isNew: sellTimestamp > (lastUpdateTime || new Date(0)),
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

		// Check for signals every 60 seconds
		checkForSignals(); // Initial call to populate the notifications
		const intervalId = setInterval(() => {
			checkForSignals();
			setLastUpdateTime(new Date()); // Update last update time every 60 seconds
		}, 60000);

		return () => clearInterval(intervalId);
	}, [selectedPeriod, enabledIndicators, lastUpdateTime, user]);

	return (
		<>
			<Card className="mt-4">
				<CardHeader className="flex flex-wrap justify-between items-center">
					<CardTitle>Real-time Notifications</CardTitle>
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
				</CardHeader>
				<ScrollArea className="h-[400px] mt-2">
					<CardContent>
						{notifications.length === 0 ? (
							<p>Loading...</p>
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
											{format(notification.timestamp, "yyyy-MM-dd HH:mm")}
										</span>
									</li>
								))}
							</ul>
						)}
					</CardContent>
				</ScrollArea>
			</Card>
		</>
	);
};

export default NotificationBoard;
