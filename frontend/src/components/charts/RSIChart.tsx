import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { RSI } from "@/utils/Indicators";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function calculateRSIProfit(prices: number[], rsiData: number[]) {
	let capital = 100; // Start with an initial capital (can be any arbitrary value)
	let latestBuyPrice = null;
	const buyPoints = [];
	const sellPoints = [];

	for (let i = 1; i < rsiData.length; i++) {
		// Buy signal: RSI crosses above 30
		if (rsiData[i - 1] < 30 && rsiData[i] > 30 && rsiData[i - 1] != null) {
			latestBuyPrice = prices[i];
			buyPoints.push({ x: i, y: rsiData[i] });
		}
		// Sell signal: RSI crosses below 70
		else if (
			rsiData[i - 1] > 70 &&
			rsiData[i] < 70 &&
			latestBuyPrice !== null
		) {
			// Calculate profit/loss for this trade and update capital
			capital = capital * (1 + (prices[i] - latestBuyPrice) / latestBuyPrice);
			sellPoints.push({ x: i, y: rsiData[i] });
			latestBuyPrice = null; // Reset after tracking the latest sell
		}
	}

	// If there's an open position at the end, close it using the last price
	if (latestBuyPrice !== null) {
		capital =
			capital *
			(1 + (prices[prices.length - 1] - latestBuyPrice) / latestBuyPrice);
	}

	// Compound profit/loss is the difference between the final capital and initial capital
	const profit = capital - 100;

	return { profit, buyPoints, sellPoints };
}

interface DataPoint {
	x: Date;
	y: number;
}

interface Dataset {
	label: string;
	data: DataPoint[];
	borderColor: string;
	borderWidth: number;
	backgroundColor: string;
	fill: boolean;
	tension: number;
}

interface RSIChartProps {
	formattedData: {
		labels: Date[];
		datasets: Dataset[];
	};
	period?: number;
	options?: any;
}

export default function RSIChart({
	formattedData,
	period = 14,
	options = {},
}: RSIChartProps) {
	// Calculate RSI data using useMemo
	const rsiData = useMemo(() => {
		if (
			!formattedData ||
			!formattedData.datasets ||
			formattedData.datasets.length === 0
		) {
			console.error("Invalid data structure provided to RSIChart");
			return null;
		}

		const prices = formattedData.datasets[0].data.map((point) => point.y);
		return RSI(prices, period);
	}, [formattedData, period]);

	if (!rsiData) return null;

	const prices = formattedData.datasets[0].data.map((point) => point.y);

	// Calculate profit and buy/sell points
	const { profit, buyPoints, sellPoints } = useMemo(() => {
		return calculateRSIProfit(prices, rsiData);
	}, [prices, rsiData]);

	// Prepare chart data
	const chartData = {
		labels: formattedData.labels,
		datasets: [
			{
				label: "RSI",
				data: rsiData.map((value, index) => ({
					x: formattedData.labels[index],
					y: value,
				})),
				borderColor: "brown",
				borderWidth: 2,
				backgroundColor: "rgba(0, 255, 0, 0.1)",
				fill: false,
			},
			{
				label: "Buy Points",
				data: buyPoints.map((point) => ({
					x: formattedData.labels[point.x],
					y: point.y,
				})),
				backgroundColor: "green",
				borderColor: "green",
				pointRadius: 5,
				showLine: false,
			},
			{
				label: "Sell Points",
				data: sellPoints.map((point) => ({
					x: formattedData.labels[point.x],
					y: point.y,
				})),
				backgroundColor: "red",
				borderColor: "red",
				pointRadius: 5,
				showLine: false,
			},
		],
	};

	const customOptions = {
		...options,
		scales: {
			...options.scales,
			y: {
				suggestedMin: 0,
				suggestedMax: 100,
			},
		},
	};

	return (
		<>
			<CardHeader className="flex items-center gap-2 space-y-0 py-5 sm:flex-row">
				<div className="grid flex-1 gap-1 text-center sm:text-left">
					<CardTitle>RSI({period})</CardTitle>
					<CardDescription
						className={`${
							profit > 0 ? "text-base text-green-500" : "text-base text-red-500"
						}`}
					>
						Potential Profit: {profit.toFixed(2)}%
					</CardDescription>
				</div>
			</CardHeader>
			<Line data={chartData} options={customOptions} />
		</>
	);
}
