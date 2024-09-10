import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { StochRSI } from "@/utils/Indicators"; // Ensure you have this utility
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateStochRSIProfit } from "@/utils/calculateProfit"; // Ensure you have this utility
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

interface StochRSIChartProps {
	formattedData: FormattedChartData;
	period?: number;
	kPeriod?: number;
	dPeriod?: number;
	options?: ChartOptions;
}

export default function StochRSIChart({
	formattedData,
	period = 14,
	kPeriod = 3,
	dPeriod = 3,
	options = {},
}: StochRSIChartProps) {
	// Calculate StochRSI data using useMemo
	const stochRSIData = useMemo(() => {
		if (
			!formattedData ||
			!formattedData.datasets ||
			formattedData.datasets.length === 0
		) {
			console.error("Invalid data structure provided to StochRSIChart");
			return null;
		}

		const prices = formattedData.datasets[0].data.map(
			(point: { y: number }) => point.y
		);
		const { kLine, dLine } = StochRSI(
			prices as number[],
			period,
			kPeriod,
			dPeriod
		); // Ensure this function exists
		return { kLine, dLine };
	}, [formattedData, period, kPeriod, dPeriod]);

	if (!stochRSIData) return null;

	const prices = formattedData.datasets[0].data.map(
		(point: { y: number }) => point.y as number
	);

	const { profit, buyPoints, sellPoints } = calculateStochRSIProfit(
		prices,
		stochRSIData.kLine,
		stochRSIData.dLine
	);

	// Prepare chart data
	const chartData = {
		labels: formattedData.labels,
		datasets: [
			{
				label: "StochRSI %K",
				data: stochRSIData.kLine.map((value, index) => ({
					x: formattedData.labels[index],
					y: value,
				})),
				borderColor: "purple",
				borderWidth: 1.5,
				backgroundColor: "rgba(128, 0, 128, 0.1)",
				fill: false,
			},
			{
				label: "StochRSI %D",
				data: stochRSIData.dLine.map((value, index) => ({
					x: formattedData.labels[index],
					y: value,
				})),
				borderColor: "blue",
				borderWidth: 1.5,
				backgroundColor: "rgba(0, 0, 255, 0.1)",
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
		...(options as ChartOptions<"line">),
		scales: {
			...((options as ChartOptions<"line">)?.scales || {}),
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
					<CardTitle className="text-xl">
						StochRSI({period}, {kPeriod}, {dPeriod})
					</CardTitle>
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
