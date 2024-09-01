import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { SMA } from "@/utils/Indicators";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateSMAProfit } from "@/utils/calculateProfit";
import { ChartOptions } from "chart.js";

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
interface FormattedChartData {
	labels: Date[];
	datasets: Dataset[];
}

interface SMAChartProps {
	formattedData: FormattedChartData;
	period?: number;
	options?: ChartOptions;
}

export default function SMAChart({
	formattedData,
	period = 14,
	options = {},
}: SMAChartProps) {
	// Calculate SMA data using useMemo
	const smaData = useMemo(() => {
		if (
			!formattedData ||
			!formattedData.datasets ||
			formattedData.datasets.length === 0
		) {
			console.error("Invalid data structure provided to SMAChart");
			return null;
		}

		// Extract prices from the formatted data
		const prices = formattedData.datasets[0].data.map(
			(point: { y: number }) => point.y
		);
		// Calculate SMA
		return SMA(prices, period);
	}, [formattedData, period]);

	if (!smaData) return null;

	// Extract prices again for profit calculation
	const prices = formattedData.datasets[0].data.map(
		(point: { y: number }) => point.y
	);

	// Calculate profit, buy points, and sell points
	const { profit, buyPoints, sellPoints } = calculateSMAProfit(prices, smaData);

	// Prepare chart data
	const chartData = {
		labels: formattedData.labels,
		datasets: [
			{
				label: "Price",
				data: prices.map((value: number, index: number) => ({
					x: formattedData.labels[index],
					y: value,
				})),
				borderColor: "black",
				borderWidth: 1,
				fill: false,
			},
			{
				label: "SMA",
				data: smaData.map((value, index) => ({
					x: formattedData.labels[index],
					y: value,
				})),
				borderColor: "blue",
				borderWidth: 1,
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

	// Merge custom options with default options
	const customOptions = {
		...options,
	};

	return (
		<>
			<CardHeader className="flex items-center gap-2 space-y-0 py-5 sm:flex-row">
				<div className="grid flex-1 gap-1 text-center sm:text-left">
					<CardTitle className="text-xl">SMA({period})</CardTitle>
					<CardDescription
						className={`${
							profit > 0 ? "text-base text-green-500" : "text-base text-red-500"
						}`}
					>
						Potential Profit: {profit.toFixed(2)}%
					</CardDescription>
				</div>
			</CardHeader>
			<Line data={chartData} options={customOptions as object} />
		</>
	);
}
