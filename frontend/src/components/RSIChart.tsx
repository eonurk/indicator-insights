import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { RSI } from "@/utils/Indicators";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Calculate profit based on RSI with buy/sell signals
function calculateRSIProfit(prices: any[], rsiData: string | any[]) {
	let positions = [];
	let profit = 0;
	let status = false; // bought if true, sold otherwise
	const buyPoints = [];
	const sellPoints = [];
	// [TODO]: SOMETHING IS OFF. We need to check for pushing many buy price.
	for (let i = 1; i < rsiData.length; i++) {
		if (rsiData[i - 1] < 30 && rsiData[i] > 30 && rsiData[i - 1] != null) {
			// Buy signal
			status = true;
			positions.push(prices[i]);
			buyPoints.push({ x: i, y: rsiData[i] });
		} else if (rsiData[i - 1] > 70 && rsiData[i] < 70 && positions.length > 0) {
			// Sell signal
			status = false;
			let buyPrice = positions.pop();
			profit += ((prices[i] - buyPrice) / buyPrice) * 100;
			sellPoints.push({ x: i, y: rsiData[i] });
		}
	}

	// if the last position is buy add it to the latest position
	if (status) {
		let lastBuy = buyPoints[buyPoints.length - 1].y;
		profit += ((prices[prices.length - 1] - lastBuy) / lastBuy) * 100;
	}

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
	RSIperiod?: number;
	options?: any;
}

export default function RSIChart({
	formattedData,
	RSIperiod = 14,
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
		return RSI(prices, RSIperiod);
	}, [formattedData, RSIperiod]);

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
					<CardTitle>RSI({RSIperiod})</CardTitle>
					<CardDescription>Total Profit: {profit.toFixed(2)}%</CardDescription>
				</div>
			</CardHeader>
			<Line data={chartData} options={customOptions} />
		</>
	);
}
