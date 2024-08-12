import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { RMI, RSI } from "@/utils/Indicators";
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

interface RMIChartProps {
	formattedData: {
		labels: Date[];
		datasets: Dataset[];
	};
	RMIperiod?: number;
	options?: any;
}

export default function RMIChart({
	formattedData,
	RMIperiod = 14,
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
		console.log(prices.length);
		const rmi = RMI(prices, RMIperiod);
		console.log(rmi);
		return rmi;
	}, [formattedData, RMIperiod]);

	if (!rmiData) return null;

	const chartData = {
		labels: formattedData.labels.slice(RMIperiod),
		datasets: [
			{
				label: "RMI",
				data: rmiData.map((value, index) => ({
					x: formattedData.labels[index],
					y: value,
				})),
				borderColor: "green",
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
					<CardTitle>RMI({RMIperiod})</CardTitle>
					<CardDescription>RMI({RMIperiod})</CardDescription>
				</div>
			</CardHeader>
			<Line data={chartData} options={options} />
		</>
	);
}
