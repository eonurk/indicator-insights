import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { RSI } from "@/utils/Indicators";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	CardFooter,
} from "@/components/ui/card";
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
	RSIperiod?: number;
	options?: any;
}

export default function RSIChart({
	formattedData,
	RSIperiod = 14,
	options = {},
}: RSIChartProps) {
	const rmiData = useMemo(() => {
		if (
			!formattedData ||
			!formattedData.datasets ||
			formattedData.datasets.length === 0
		) {
			console.error("Invalid data structure provided to RSIChart");
			return null;
		}

		const prices = formattedData.datasets[0].data.map((point) => point.y);
		return RSI(prices, RSIperiod);
	}, [formattedData, RSIperiod]);

	if (!rmiData) return null;

	const chartData = {
		labels: formattedData.labels.slice(RSIperiod - 1),
		datasets: [
			{
				label: "RSI",
				data: rmiData.map((value, index) => ({
					x: formattedData.labels[index + RSIperiod - 1],
					y: value,
				})),
				borderColor: "brown",
				borderWidth: 2,
				backgroundColor: "rgba(0, 255, 0, 0.1)",
				fill: false,
			},
		],
	};

	return (
		<>
			<CardHeader className="flex items-center gap-2 space-y-0 py-5 sm:flex-row">
				<div className="grid flex-1 gap-1 text-center sm:text-left">
					<CardTitle>RSI({RSIperiod})</CardTitle>
					<CardDescription>RSI({RSIperiod})</CardDescription>
				</div>
			</CardHeader>
			<Line data={chartData} options={options} />
		</>
	);
}
