import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { MACD } from "@/utils/Indicators";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function calculateMACDProfit(
	prices: number[],
	macdData: number[],
	signalData: number[]
) {
	let capital = 100; // Start with an initial capital
	let latestBuyPrice = null;
	const buyPoints = [];
	const sellPoints = [];

	for (let i = 1; i < macdData.length; i++) {
		// Buy signal: MACD crosses above Signal line
		if (macdData[i - 1] < signalData[i - 1] && macdData[i] > signalData[i]) {
			latestBuyPrice = prices[i];
			buyPoints.push({ x: i, y: macdData[i] });
		}
		// Sell signal: MACD crosses below Signal line
		else if (
			macdData[i - 1] > signalData[i - 1] &&
			macdData[i] < signalData[i] &&
			latestBuyPrice !== null
		) {
			// Calculate profit/loss for this trade and update capital
			capital = capital * (1 + (prices[i] - latestBuyPrice) / latestBuyPrice);
			sellPoints.push({ x: i, y: macdData[i] });
			latestBuyPrice = null;
		}
	}

	// Close open position at the end
	if (latestBuyPrice !== null) {
		capital =
			capital *
			(1 + (prices[prices.length - 1] - latestBuyPrice) / latestBuyPrice);
	}

	const profit = capital - 100;
	return { profit, buyPoints, sellPoints };
}

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
	const macdResults = useMemo(() => {
		if (
			!formattedData ||
			!formattedData.datasets ||
			formattedData.datasets.length === 0
		) {
			console.error("Invalid data structure provided to MACDChart");
			return null;
		}

		const prices = formattedData.datasets[0].data.map((point) => point.y);
		return MACD(prices, fastPeriod, slowPeriod, signalPeriod);
	}, [formattedData, fastPeriod, slowPeriod, signalPeriod]);

	if (!macdResults) return null;

	const prices = formattedData.datasets[0].data.map((point) => point.y);
	const { macdLine, signalLine, histogram } = macdResults;

	const { profit, buyPoints, sellPoints } = useMemo(() => {
		return calculateMACDProfit(prices, macdLine, signalLine);
	}, [prices, macdLine, signalLine]);

	const chartData = {
		labels: formattedData.labels,
		datasets: [
			// {
			// 	label: "MACD Line",
			// 	data: macdLine.map((value, index) => ({
			// 		x: formattedData.labels[index],
			// 		y: value,
			// 	})),
			// 	borderColor: "blue",
			// 	borderWidth: 2,
			// 	fill: false,
			// },
			// {
			// 	label: "Signal Line",
			// 	data: signalLine.map((value, index) => ({
			// 		x: formattedData.labels[index],
			// 		y: value,
			// 	})),
			// 	borderColor: "orange",
			// 	borderWidth: 2,
			// 	fill: false,
			// },

			{
				label: "Buy Points",
				data: buyPoints.map((point) => ({
					x: formattedData.labels[point.x],
					y: point.y,
				})),
				backgroundColor: "green",
				borderColor: "green",
				pointRadius: 3,
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
				pointRadius: 3,
				showLine: false,
			},
			{
				label: "Histogram",
				type: "bar",
				data: histogram.map((value, index) => ({
					x: formattedData.labels[index],
					y: value,
				})),
				backgroundColor: (value: { y: number }) =>
					value.y > 0 ? "gray" : "gray",
				barThickness: 2,
			},
		],
	};

	const customOptions = {
		...options,
	};

	return (
		<>
			<CardHeader className="flex items-center gap-2 space-y-0 py-5 sm:flex-row">
				<div className="grid flex-1 gap-1 text-center sm:text-left">
					<CardTitle>
						MACD ({fastPeriod},{slowPeriod},{signalPeriod})
					</CardTitle>
					<CardDescription
						className={`${profit > 0 ? "text-green-500" : "text-red-500"}`}
					>
						Total Profit: {profit.toFixed(2)}%
					</CardDescription>
				</div>
			</CardHeader>
			<Line data={chartData} options={customOptions} />
		</>
	);
}
