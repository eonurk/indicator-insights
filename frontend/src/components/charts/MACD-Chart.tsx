import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { MACD } from "@/utils/Indicators";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
export function calculateMACDProfit(
	prices: number[],
	macdData: number[],
	signalData: number[]
) {
	let capital = 100; // Initial capital
	let latestBuyPrice: number | null = null; // Initialize as null
	let latestSellPrice: number | null = null; // Initialize as null
	const buyPoints: { x: number; y: number }[] = [];
	const sellPoints: { x: number; y: number }[] = [];

	for (let i = 1; i < macdData.length; i++) {
		// Buy signal: MACD crosses above Signal line
		if (macdData[i - 1] < signalData[i - 1] && macdData[i] > signalData[i]) {
			// Only buy if we don't have an existing buy position
			if (latestBuyPrice === null) {
				latestBuyPrice = prices[i]; // Set buy price
				buyPoints.push({ x: i, y: macdData[i] });
			}
		}
		// Sell signal: MACD crosses below Signal line
		else if (
			macdData[i - 1] > signalData[i - 1] &&
			macdData[i] < signalData[i] &&
			latestBuyPrice !== null
		) {
			latestSellPrice = prices[i]; // Set sell price
			// Calculate profit only when selling
			capital *= 1 + (latestSellPrice - latestBuyPrice) / latestBuyPrice;
			sellPoints.push({ x: i, y: macdData[i] });

			latestBuyPrice = null; // Reset buy price after selling
		}
	}

	// Close any open position at the end using the latest price
	if (latestBuyPrice !== null) {
		latestSellPrice = prices[prices.length - 1]; // Close at the last price
		capital *= 1 + (latestSellPrice - latestBuyPrice) / latestBuyPrice;
	}

	const profit = capital - 100; // Calculate profit based on initial capital

	// Guard against NaN
	if (isNaN(profit)) {
		console.error("Profit calculation resulted in NaN");
	}

	return { profit, buyPoints, sellPoints, latestBuyPrice, latestSellPrice };
}

// MACD Chart component
interface MACDChartProps {
	formattedData: {
		labels: Date[];
		datasets: Dataset[];
	};
	fastPeriod?: number;
	slowPeriod?: number;
	signalPeriod?: number;
	options?: any;
}

export default function MACDChart({
	formattedData,
	fastPeriod = 12,
	slowPeriod = 26,
	signalPeriod = 9,
	options = {},
}: MACDChartProps) {
	// Extract prices from the formatted data
	const prices = useMemo(() => {
		if (
			!formattedData ||
			!formattedData.datasets ||
			formattedData.datasets.length === 0
		) {
			console.error("Invalid data structure provided to MACDChart");
			return [];
		}
		return formattedData.datasets[0].data.map((point: { y: any }) => point.y);
	}, [formattedData]);

	// Calculate MACD, Signal Line, and Histogram
	const macdResults = useMemo(() => {
		if (prices.length === 0) return null;
		return MACD(prices, fastPeriod, slowPeriod, signalPeriod);
	}, [prices, fastPeriod, slowPeriod, signalPeriod]);

	if (!macdResults) return <div>No valid MACD data available.</div>;

	const { macdLine, signalLine, histogram } = macdResults;

	// Calculate potential profit and identify buy/sell points
	const { profit, buyPoints, sellPoints } = useMemo(() => {
		return calculateMACDProfit(prices, macdLine, signalLine);
	}, [prices, macdLine, signalLine]);

	// Prepare data for chart rendering
	const chartData = {
		labels: formattedData.labels,
		datasets: [
			{
				label: "Buy Points",
				data: buyPoints.map((point) => ({
					x: formattedData.labels[point.x],
					y: point.y,
				})),
				backgroundColor: "green", // Green for Buy
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
				backgroundColor: "red", // Red for Sell
				borderColor: "red",
				pointRadius: 5,
				showLine: false,
			},
			{
				label: "MACD Line",
				data: macdLine.map((value, index) => ({
					x: formattedData.labels[index],
					y: value,
				})),
				fill: false,
				borderColor: "grey",
				borderWidth: 1,
				tension: 0.1,
			},
			{
				label: "Signal Line",
				data: signalLine.map((value, index) => ({
					x: formattedData.labels[index],
					y: value,
				})),
				borderColor: "blue",
				borderWidth: 1,
				fill: false,
				tension: 0.1,
			},
			{
				label: "Histogram",
				type: "bar" as const,
				data: histogram.map((value, index) => ({
					x: formattedData.labels[index],
					y: value,
				})),
				backgroundColor: histogram.map((value) =>
					value > 0 ? "green" : "red"
				),
				barThickness: 1,
			},
		],
	};

	const customOptions = {
		...options,
	};

	// Render the MACD chart along with potential profit
	return (
		<>
			<CardHeader className="flex items-center gap-2 space-y-0 py-5 sm:flex-row">
				<div className="grid flex-1 gap-1 text-center sm:text-left">
					<CardTitle className="text-xl">
						MACD ({fastPeriod},{slowPeriod},{signalPeriod})
					</CardTitle>
					<CardDescription
						className={`text-base ${
							profit > 0
								? "text-green-500"
								: profit < 0
								? "text-red-500"
								: "text-neutral-500"
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
