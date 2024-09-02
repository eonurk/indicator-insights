import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { RMI } from "@/utils/Indicators";
import { calculateRMIProfit } from "@/utils/calculateProfit"; // Import the function
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

interface RMIChartProps {
	formattedData: FormattedChartData;
	period?: number;
	options?: object;
}

export default function RMIChart({
	formattedData,
	period = 14,
	options = {},
}: RMIChartProps) {
	const rmiData = useMemo(() => {
		if (
			!formattedData ||
			!formattedData.datasets ||
			formattedData.datasets.length === 0
		) {
			console.error("Invalid data structure provided to RMIChart");
			return null;
		}

		const prices = formattedData.datasets[0].data.map((point) => point.y);
		const rmi = RMI(prices, period);
		return rmi;
	}, [formattedData, period]);

	if (!rmiData) return null;

	const prices = formattedData.datasets[0].data.map((point) => point.y);
	// Calculate profit and buy/sell points
	const { profit, buyPoints, sellPoints } = calculateRMIProfit(prices, rmiData);

	const chartData = {
		labels: formattedData.labels,
		datasets: [
			{
				label: "Buy Points",
				data: buyPoints.map((point) => ({
					x: formattedData.labels[point.x],
					y: point.y,
				})),
				backgroundColor: "#22c55e",
				borderColor: "#22c55e",
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
			{
				label: "RMI",
				data: rmiData.map((value, index) => ({
					x: formattedData.labels[index],
					y: value,
				})),
				borderColor: "darkblue",
				borderWidth: 2,
				backgroundColor: "rgba(0, 255, 0, 0.1)",
				fill: false,
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
					<CardTitle className="text-xl">RMI({period})</CardTitle>
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
