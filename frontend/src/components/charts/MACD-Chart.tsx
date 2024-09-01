import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { MACD } from "@/utils/Indicators";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartData, ChartOptions } from "chart.js";
import { calculateMACDProfit } from "@/utils/calculateProfit";

interface DataPoint {
	x: number;
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
interface FormattedChartData {
	labels: Date[];
	datasets: Dataset[];
}

// MACD Chart component
interface MACDChartProps {
	formattedData: FormattedChartData;
	fastPeriod?: number;
	slowPeriod?: number;
	signalPeriod?: number;
	options?: ChartOptions<"line">;
}

export default function MACDChart({
	formattedData,
	fastPeriod = 26,
	slowPeriod = 12,
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
		return formattedData.datasets[0].data.map((point) => point.y);
	}, [formattedData]);

	// Calculate MACD, Signal Line, and Histogram
	const macdResults = useMemo(() => {
		if (prices.length === 0) return null;
		return MACD(prices, fastPeriod, slowPeriod, signalPeriod);
	}, [prices, fastPeriod, slowPeriod, signalPeriod]);

	if (!macdResults) return <div>No valid MACD data available.</div>;

	const { macdLine, signalLine, histogram } = macdResults;

	// Calculate potential profit and identify buy/sell points
	const { profit, buyPoints, sellPoints } = calculateMACDProfit(
		prices,
		macdLine,
		signalLine
	);

	// Prepare data for chart rendering
	const chartData: ChartData<"line" | "scatter" | "bar"> = {
		labels: formattedData.labels,
		datasets: [
			{
				type: "scatter" as const,
				label: "Buy Points",
				data: buyPoints.map((point) => ({
					x: formattedData.labels[point.x].getTime(), // Convert Date to timestamp
					y: point.y,
				})),
				backgroundColor: "green", // Green for Buy
				borderColor: "green",
				pointRadius: 5,
			},
			{
				type: "scatter" as const,
				label: "Sell Points",
				data: sellPoints.map((point) => ({
					x: formattedData.labels[point.x].getTime(), // Convert Date to timestamp
					y: point.y,
				})),
				backgroundColor: "red", // Red for Sell
				borderColor: "red",
				pointRadius: 5,
			},
			{
				type: "line" as const,
				label: "MACD Line",
				data: macdLine.map((value, index) => ({
					x: formattedData.labels[index].getTime(), // Convert Date to timestamp
					y: value,
				})),
				fill: false,
				borderColor: "grey",
				borderWidth: 1,
				tension: 0.1,
			},
			{
				type: "line" as const,
				label: "Signal Line",
				data: signalLine.map((value, index) => ({
					x: formattedData.labels[index].getTime(), // Convert Date to timestamp
					y: value,
				})),
				borderColor: "blue",
				borderWidth: 1,
				fill: false,
				tension: 0.1,
			},
			{
				type: "bar" as const,
				label: "Histogram",
				data: histogram.map((value, index) => ({
					x: formattedData.labels[index].getTime(), // Convert Date to timestamp
					y: value,
				})),
				backgroundColor: histogram.map((value) =>
					value > 0 ? "green" : "red"
				),
				borderColor: histogram.map((value) => (value > 0 ? "green" : "red")),
				borderWidth: 1,
			},
		],
	};

	const customOptions: ChartOptions<"line"> = {
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
			<Line data={chartData as ChartData<"line">} options={customOptions} />
		</>
	);
}
