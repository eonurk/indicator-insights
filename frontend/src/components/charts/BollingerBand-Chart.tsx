import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { BollingerBands } from "@/utils/Indicators";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function calculateBollingerProfit(
	prices: number[],
	upperBand: number[],
	lowerBand: number[]
) {
	let capital = 100;
	let latestBuyPrice = null;
	const buyPoints = [];
	const sellPoints = [];

	for (let i = 1; i < prices.length; i++) {
		// Buy signal: Price crosses below the lower band
		if (prices[i] < lowerBand[i] && prices[i - 1] >= lowerBand[i - 1]) {
			latestBuyPrice = prices[i];
			buyPoints.push({ x: i, y: prices[i] });
		}
		// Sell signal: Price crosses above the upper band
		else if (
			prices[i] > upperBand[i] &&
			prices[i - 1] <= upperBand[i - 1] &&
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

interface BollingerChartProps {
	formattedData: FormattedChartData;
	period?: number;
	stdDev?: number;
	options?: unknown;
}

export default function BollingerChart({
	formattedData,
	period = 20,
	stdDev = 2,
	options = {},
}: BollingerChartProps) {
	const bandsData = useMemo(() => {
		if (
			!formattedData ||
			!formattedData.datasets ||
			formattedData.datasets.length === 0
		) {
			console.error("Invalid data structure provided to BollingerChart");
			return null;
		}

		const prices = formattedData.datasets[0].data
			.map((point: number | { y: number } | null) =>
				typeof point === "object" && point !== null ? point.y : point
			)
			.filter((y): y is number => y !== null);
		return BollingerBands(prices, period, stdDev);
	}, [formattedData, period, stdDev]);

	if (!bandsData) return null;

	const upperBand = bandsData
		.map((band) => band.upper)
		.filter((v): v is number => v !== null);
	const lowerBand = bandsData
		.map((band) => band.lower)
		.filter((v): v is number => v !== null);
	const { profit, buyPoints, sellPoints } = calculateBollingerProfit(
		formattedData.datasets[0].data
			.map((point: number | { y: number } | null) =>
				typeof point === "object" && point !== null ? point.y : point
			)
			.filter((y): y is number => y !== null),
		upperBand,
		lowerBand
	);

	const chartData = {
		labels: formattedData.labels,
		datasets: [
			{
				label: "Price",
				data: formattedData.datasets[0].data.map(
					(value: number | { y: number } | null, index: number) => ({
						x: formattedData.labels?.[index] ?? index,
						y: value,
					})
				),
				borderColor: "black",
				borderWidth: 2,
				fill: false,
			},
			{
				label: "Upper Band",
				data: upperBand.map((value: number | null, index: number) => ({
					x: formattedData.labels?.[index] ?? index,
					y: value,
				})),
				borderColor: "blue",
				borderWidth: 1,
				fill: false,
			},
			{
				label: "Lower Band",
				data: lowerBand.map((value: number | null, index: number) => ({
					x: formattedData.labels?.[index] ?? index,
					y: value,
				})),
				borderColor: "blue",
				borderWidth: 1,
				fill: false,
			},
			{
				label: "Middle Band",
				data: formattedData.datasets[0].data.map(
					(value: number | { y: number } | null, index: number) => ({
						x: formattedData.labels?.[index] ?? index,
						y: typeof value === "object" && value !== null ? value.y : value,
					})
				),
				borderColor: "grey",
				borderWidth: 1,
				fill: false,
			},
			{
				label: "Buy Points",
				data: buyPoints.map((point: { x: number; y: number }) => ({
					x: formattedData.labels?.[point.x] ?? point.x,
					y: point.y,
				})),
				backgroundColor: "green",
				borderColor: "green",
				pointRadius: 5,
				showLine: false,
			},
			{
				label: "Sell Points",
				data: sellPoints.map((point: { x: number; y: number }) => ({
					x: formattedData.labels?.[point.x] ?? point.x,
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
		...(options as object),
	};

	return (
		<>
			<CardHeader className="flex items-center gap-2 space-y-0 py-5 sm:flex-row">
				<div className="grid flex-1 gap-1 text-center sm:text-left">
					<CardTitle className="text-xl">
						Bollinger Bands ({period},{stdDev})
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
