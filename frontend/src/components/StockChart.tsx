import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
	CategoryScale,
	Chart as ChartJS,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	TimeScale,
	TimeSeriesScale,
} from "chart.js";
import "chartjs-adapter-date-fns";
// import { Button } from "@/components/ui/button";

import { format } from "date-fns";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	CardFooter,
} from "@/components/ui/card";
import RSIChart from "@/components/RSIChart";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	TimeScale,
	TimeSeriesScale
);

interface StockHistory {
	[date: string]: {
		Close: number;
		Open: number;
		High: number;
		Low: number;
		Volume: number;
	};
}

const stockOptions = [
	{ id: "AAPL", name: "Apple" },
	{ id: "TXG", name: "10x Genomics" },
	{ id: "MSFT", name: "Microsoft" },
	// Add more options as needed
];

interface StockData {
	symbol: string;
	history: StockHistory;
}

function StockChart() {
	const [period, setPeriod] = useState<string>("1d");
	const [symbol, setSymbol] = useState<string>("AAPL");
	const [chartData, setChartData] = useState<any>(null);
	const [cardTitle, setCardTitle] = useState<{
		symbol: string;
		currentPrice: number;
		priceChange: string;
		priceChangePercentage: string;
		lineColor: string;
		cardTitleColor: string;
	} | null>(null);

	const fetchStockData = async (symbol: string, period: string) => {
		try {
			const response = await fetch(
				`http://localhost:5000/api/stock/${symbol}?period=${period}`
			);

			const data: StockData = await response.json();
			const history = data.history;
			const dates = Object.keys(history).map((date) => new Date(date));
			const closingPrices = dates.map((date) => {
				return history[format(date, "yyyy-MM-dd HH:mm:ss")]?.Close; // Safely access the data
			});

			// Calculate the price change
			const latestPrice = closingPrices[closingPrices.length - 1];
			const initialPrice = closingPrices[0];
			const priceChange = latestPrice - initialPrice;
			const priceChangePercentage = (priceChange / initialPrice) * 100;
			const lineColor = priceChangePercentage < 0 ? "red" : "#19e64d";
			const cardTitleColor =
				priceChangePercentage < 0 ? "text-red-500" : "text-green-500";

			const formattedData = {
				labels: dates,
				datasets: [
					{
						label: `${data.symbol}`,
						data: closingPrices,
						borderColor: lineColor,
						borderWidth: 2,
						backgroundColor: lineColor,
						fill: false,
						tension: 0.1,
					},
				],
			};

			setChartData(formattedData);

			setCardTitle({
				symbol,
				currentPrice: latestPrice.toFixed(2),
				priceChange: priceChange.toFixed(2),
				priceChangePercentage: priceChangePercentage.toFixed(2),
				lineColor: lineColor,
				cardTitleColor: cardTitleColor,
			});
		} catch (error) {
			console.error("Error fetching stock data:", error);
		}
	};

	const getTimeUnit = (period: string) => {
		switch (period) {
			case "1d":
				return "hour";
			case "1w":
			case "1m":
			case "3m":
			case "ytd":
			case "1y":
				return "day";
			case "all":
				return "month";
			default:
				return "day";
		}
	};

	useEffect(() => {
		fetchStockData(symbol, period);
	}, [symbol, period]);

	return (
		<>
			<Card>
				<CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
					<div className="grid flex-1 gap-1 text-center sm:text-left">
						<CardTitle>{cardTitle?.symbol}</CardTitle>
						<CardDescription className={cardTitle?.cardTitleColor}>
							${cardTitle?.currentPrice} ({cardTitle?.priceChangePercentage}%)
						</CardDescription>
					</div>
					<div className="flex gap-1">
						<Select value={symbol} onValueChange={setSymbol}>
							<SelectTrigger
								className="w-[160px] rounded-lg sm:ml-auto"
								aria-label="Select a value"
							>
								<SelectValue placeholder="AAPL" />
							</SelectTrigger>
							<SelectContent>
								{stockOptions.map((option) => (
									<SelectItem key={option.id} value={option.id}>
										{option.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Select value={period} onValueChange={setPeriod}>
							<SelectTrigger
								className="w-[160px] rounded-lg sm:ml-auto"
								aria-label="Select a value"
							>
								<SelectValue placeholder="1d" />
							</SelectTrigger>
							<SelectContent position="popper">
								<SelectItem value="1d">1 Day</SelectItem>
								<SelectItem value="1w">1 Week</SelectItem>
								<SelectItem value="1m">1 Month</SelectItem>
								<SelectItem value="3m">3 Months</SelectItem>
								<SelectItem value="ytd">Year to Date</SelectItem>
								<SelectItem value="1y">1 Year</SelectItem>
								<SelectItem value="all">All</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardHeader>
				<CardContent>
					{chartData && (
						<Line
							data={chartData}
							options={{
								elements: {
									point: {
										radius: 0, // No points on the line
									},
									line: {
										borderWidth: 10,
										tension: 0.1, // Optional: adds a slight curve to the line
									},
								},
								scales: {
									x: {
										type: "timeseries",
										time: {
											unit: getTimeUnit(period),
											tooltipFormat: "MMM d, yyyy",
										},
										ticks: {
											source: "labels",
											autoSkip: true, // Skip labels if too crowded
											maxTicksLimit: 10, // Limit the number of ticks shown
										},
										grid: {
											display: false, // Remove grid lines
										},
									},
									y: {
										title: {
											display: false,
											text: "Price (USD)",
										},
										border: {
											display: false,
										},
										grid: {
											drawBorder: false,
											display: true, // Optionally show the y-axis grid lines
										},
										ticks: {
											autoSkip: true, // Skip labels if too crowded
											maxTicksLimit: 10, // Limit the number of ticks shown
										},
									},
								},
								responsive: true,
								plugins: {
									tooltip: {
										mode: "index", // Tooltip shows for the closest point
										intersect: false,
										backgroundColor: "rgba(0, 0, 0, 0.7)", // Tooltip background color
										// titleColor: "white", // Tooltip title color
										// bodyColor: "white", // Tooltip body color
									},
									legend: {
										display: false,
									},
								},

								// Remove background color
								backgroundColor: "transparent",
							}}
						/>
					)}
				</CardContent>
				<CardFooter></CardFooter>
			</Card>
		</>
	);
}

export default StockChart;
