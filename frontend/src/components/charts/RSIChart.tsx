import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { RSI } from "@/utils/Indicators";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateRSIProfit } from "@/utils/calculateProfit";
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

interface RSIChartProps {
	formattedData: FormattedChartData;
	period?: number;
	options?: ChartOptions<"line">;
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
	const { profit, buyPoints, sellPoints } = calculateRSIProfit(prices, rsiData);

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
					<CardTitle className="text-xl">RSI({period})</CardTitle>
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
