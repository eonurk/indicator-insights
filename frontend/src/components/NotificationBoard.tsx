import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { fetchStockData } from "@/fetchStockData";
import { RMI } from "@/utils/Indicators";
import { format } from "date-fns";
import { calculateRMIProfit } from "@/components/charts/RMIChart"; // Import the function
import { ScrollArea } from "@/components/ui/scroll-area";

interface Notification {
	id: string;
	stock: string;
	indicator: string;
	signal: "buy" | "sell";
	price: number;
	timestamp: Date;
	isNew: boolean;
}

const NotificationBoard: React.FC = () => {
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(new Date());

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
			const period = "1m"; // Fetch historical data for better signal tracking
			const newNotifications: Notification[] = [];

			try {
				const response = await fetchStockData(stocks.join(","), period, false);

				for (let symbol of stocks) {
					const history = response[symbol].history;
					const dates = Object.keys(history).map((date) => new Date(date));
					const closingPrices = dates
						.map((date) => history[format(date, "yyyy-MM-dd HH:mm:ss")]?.Close)
						.filter((price) => price !== undefined) as number[];

					// Calculate RMI values and signals
					const rmiValues = RMI(closingPrices, 14);
					const { buyPoints, sellPoints, latestBuyPrice, latestSellPrice } =
						calculateRMIProfit(closingPrices, rmiValues);

					// Check which signal is the latest
					if (latestBuyPrice !== null) {
						const latestBuyPoint = buyPoints[buyPoints.length - 1];
						newNotifications.push({
							id: `${symbol}-buy-${Date.now()}`,
							stock: symbol,
							indicator: "RMI",
							signal: "buy",
							price: latestBuyPrice,
							timestamp: dates[latestBuyPoint.x], // Use the date of the buy signal
							isNew: false, // Not highlighting historical data
						});
					} else if (latestSellPrice !== null) {
						const latestSellPoint = sellPoints[sellPoints.length - 1];
						newNotifications.push({
							id: `${symbol}-sell-${Date.now()}`,
							stock: symbol,
							indicator: "RMI",
							signal: "sell",
							price: latestSellPrice,
							timestamp: dates[latestSellPoint.x], // Use the date of the sell signal
							isNew: false, // Not highlighting historical data
						});
					}
				}

				setNotifications(newNotifications); // Replace previous notifications with the latest data
				setLastUpdateTime(new Date());
			} catch (error) {
				console.error("Error fetching stock data:", error);
			}
		};

		checkForSignals(); // Check immediately on mount
		const intervalId = setInterval(checkForSignals, 60000); // Then check every minute

		return () => clearInterval(intervalId);
	}, []);

	return (
		<Card className="mt-4">
			<CardHeader>
				<CardTitle>Real-time Notifications</CardTitle>
				{lastUpdateTime && (
					<>
						<div className="flex items-center justify-center text-sm text-gray-500">
							<span className="bg-green-500 h-3 w-3 rounded-full animate-pulse"></span>
							<span className="ml-2">
								Last updated: {lastUpdateTime?.toLocaleTimeString()}
							</span>
						</div>
					</>
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
									className="mb-2 p-2 rounded bg-gray-100"
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
										{notification.timestamp.toLocaleDateString()}{" "}
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
