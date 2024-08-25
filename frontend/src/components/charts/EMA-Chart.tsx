import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { EMA } from "@/utils/Indicators";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function calculateEMAProfit(prices: number[], emaData: number[]) {
	let capital = 100;
	let latestBuyPrice = null;
	const buyPoints = [];
	const sellPoints = [];

	for (let i = 1; i < emaData.length; i++) {
		// Buy signal: Price crosses above EMA
		if (prices[i - 1] < emaData[i - 1] && prices[i] > emaData[i]) {
			latestBuyPrice = prices[i];
			buyPoints.push({ x: i, y: prices[i] });
		}
		// Sell signal: Price crosses below EMA
		else if (
			prices[i - 1] > emaData[i - 1] &&
			prices[i] < emaData[i] &&
			latestBuyPrice !== null
		) {
			capital = capital * (1 + (prices[i] - latestBuyPrice) / latestBuyPrice);
			sellPoints.push({ x: i, y: prices[i] });
			latestBuyPrice = null;
		}
	}

	if (latestBuyPrice !== null) {
		capital =
			capital *
			(1 + (prices[prices.length - 1] - latestBuyPrice) / latestBuyPrice);
	}

	const profit = capital - 100;
	return { profit, buyPoints, sellPoints };
}

interface EMAChartProps {
	formattedData: {
		labels: Date[];
		datasets: Dataset[];
	};
	period?: number;
	options?: any;
}

export default function EMAChart({
	formattedData,
	period = 100,
	options = {},
}: EMAChartProps) {
	const emaData = useMemo(() => {
		if (
			!formattedData ||
			!formattedData.datasets ||
			formattedData.datasets.length === 0
		) {
			console.error("Invalid data structure provided to EMAChart");
			return null;
		}

		const prices = formattedData.datasets[0].data.map(
			(point: { y: any }) => point.y
		);
		return EMA(prices, period);
	}, [formattedData, period]);

	if (!emaData) return null;

	const prices = formattedData.datasets[0].data.map(
		(point: { y: any }) => point.y
	);

	const { profit, buyPoints, sellPoints } = useMemo(() => {
		return calculateEMAProfit(prices, emaData);
	}, [prices, emaData]);

	const chartData = {
		labels: formattedData.labels,
		datasets: [
			{
				label: "Price",
				data: prices.map((value: any, index: string | number) => ({
					x: formattedData.labels[index],
					y: value,
				})),
				borderColor: "black",
				borderWidth: 2,
				fill: false,
			},
			{
				label: "EMA",
				data: emaData.map((value, index) => ({
					x: formattedData.labels[index],
					y: value,
				})),
				borderColor: "blue",
				borderWidth: 2,
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
	};

	return (
		<>
			<CardHeader className="flex items-center gap-2 space-y-0 py-5 sm:flex-row">
				<div className="grid flex-1 gap-1 text-center sm:text-left">
					<CardTitle className="text-xl">EMA({period})</CardTitle>
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
