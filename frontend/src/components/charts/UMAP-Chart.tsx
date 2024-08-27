// Gets stock data from the backend, calculates the UMAP, and displays the chart

import { ScatterDataPoint } from "chart.js";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Chart } from "chart.js/auto";
import { User } from "firebase/auth";
import { fetchStockData } from "@/fetchStockData";
import { stocks } from "@/utils/stocks";
import { UMAP } from "umap-js";
import { Button } from "@/components/ui/button";
import { Tooltip } from "chart.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";
import { calculateRMIProfit } from "@/components/charts/RMIChart";
import { calculateRSIProfit } from "@/components/charts/RSIChart";
import { calculateMACDProfit } from "@/components/charts/MACD-Chart";
import { MACD, RMI, RSI } from "@/utils/Indicators";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
Chart.register(Tooltip);

const periodOptions = [
	{ value: "1d", label: "1 Day" },
	{ value: "1w", label: "1 Week" },
	{ value: "1m", label: "1 Month" },
	{ value: "3m", label: "3 Months" },
	{ value: "ytd", label: "Year to Date" },
	{ value: "1y", label: "1 Year" },
	{ value: "all", label: "All" },
];

const indicatorOptions = [
	{ value: "RMI", label: "RMI" },
	{ value: "MACD", label: "MACD" },
	{ value: "RSI", label: "RSI" },
	// Add more indicators as needed
];

interface UMAPChartProps {
	user: User | null;
}

function UMAPChart({ user }: UMAPChartProps) {
	const chartRef = useRef<HTMLCanvasElement>(null);
	const chartInstance = useRef<Chart | null>(null);
	const [period, setPeriod] = useState<string>("1w");
	const [indicator, setIndicator] = useState<string>("RMI");
	const [data, setData] = useState<ScatterDataPoint[]>([]);
	const [showChart, setShowChart] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const availableStocks = useMemo(() => {
		return user
			? stocks
			: {
					AAPL: "Apple Inc.",
					ABNB: "Airbnb, Inc.",
					AMZN: "Amazon.com, Inc.",
					EBAY: "eBay Inc.",
					GOOGL: "Alphabet Inc. (Class A)",
					META: "Meta Platforms, Inc.",
					MSFT: "Microsoft Corporation",
					NFLX: "Netflix, Inc.",
					NVDA: "NVIDIA Corporation",
					PLTR: "Palantir Technologies Inc.",
					TSLA: "Tesla, Inc.",
					UBER: "Uber Technologies, Inc.",
					DIS: "The Walt Disney Company",
					PYPL: "PayPal Holdings, Inc.",
					ADBE: "Adobe Inc.",
					CRM: "Salesforce, Inc.",
					INTC: "Intel Corporation",
					AMD: "Advanced Micro Devices, Inc.",
					ZM: "Zoom Video Communications, Inc.",
					SNAP: "Snap Inc.",
					TWLO: "Twilio Inc.",
					SQ: "Block, Inc.",
					SHOP: "Shopify Inc.",
					ROKU: "Roku, Inc.",
					DDOG: "Datadog, Inc.",
			  };
	}, [user]);

	const updateChart = useCallback(() => {
		if (chartInstance.current) {
			chartInstance.current.destroy();
		}

		chartInstance.current = new Chart(chartRef.current!, {
			type: "scatter",
			data: {
				datasets: [
					{
						label: "Stocks",
						data: data,
						backgroundColor: data.map((point) => {
							const typedPoint = point as { color?: string };
							return typedPoint.color || "rgba(0, 122, 255, 0.6)";
						}),
						pointRadius: user ? 6 : 10,
					},
				],
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						display: false,
					},
					tooltip: {
						callbacks: {
							label: (context) => {
								const point = context.raw as any;
								return [
									`${point.symbol}: $${point.close.toFixed(2)}`,
									point.latestSignal
										? `(${
												point.latestSignal
										  }: ${point.latestSignalPrice.toFixed(2)})`
										: "",
								]
									.filter(Boolean)
									.join("\n");
							},
						},
					},
				},
				scales: {
					x: {
						display: false,
					},
					y: {
						display: false,
					},
				},
			},
		});
	}, [data]);

	useEffect(() => {
		if (chartRef.current && data.length > 0 && showChart) {
			updateChart();
		}
	}, [data, showChart, updateChart]);

	const fetchData = async () => {
		setIsLoading(true);
		setError(null);
		try {
			const symbols = Object.keys(availableStocks);
			const response: Record<string, StockData> = await fetchStockData(
				symbols.join(","),
				period,
				false,
				["Close"]
			);
			console.log("Fetched stock data response:", response);

			const stockDataArray = Object.values(response).map((stock: StockData) =>
				Object.values(stock.history).map((day) => day.Close)
			);

			if (stockDataArray.length === 0) {
				throw new Error("No stock data received");
			}

			const umapResult = calculateUMAP(stockDataArray, response);
			if (umapResult.length === 0) {
				throw new Error("UMAP result is empty");
			}
			setData(umapResult);
		} catch (error) {
			console.error("Error fetching or processing stock data:", error);
			setError(`Failed to process stock data: ${error}`);
		} finally {
			setIsLoading(false);
		}
	};

	const calculateProfit = (
		stockHistory: Record<string, any>,
		indicator: string
	): {
		profit: number;
		latestSignal: string | null;
		latestSignalPrice: number | null;
	} => {
		const closingPrices = Object.values(stockHistory).map(
			(day: any) => day.Close
		);

		if (indicator === "RMI") {
			const rmiData = RMI(closingPrices, 14);
			const { profit, latestBuyPrice, latestSellPrice } = calculateRMIProfit(
				closingPrices,
				rmiData
			);
			const latestSignal =
				latestBuyPrice !== null
					? "buy"
					: latestSellPrice !== null
					? "sell"
					: null;
			const latestSignalPrice =
				latestBuyPrice !== null ? latestBuyPrice : latestSellPrice;
			return { profit, latestSignal, latestSignalPrice };
		} else if (indicator === "MACD") {
			const { macdLine, signalLine } = MACD(closingPrices);
			const { profit, latestBuyPrice, latestSellPrice } = calculateMACDProfit(
				closingPrices,
				macdLine,
				signalLine
			);
			const latestSignal =
				latestBuyPrice !== null
					? "buy"
					: latestSellPrice !== null
					? "sell"
					: null;
			const latestSignalPrice =
				latestBuyPrice !== null ? latestBuyPrice : latestSellPrice;
			return { profit, latestSignal, latestSignalPrice };
		} else if (indicator === "RSI") {
			const rsiData = RSI(closingPrices, 14);
			const { profit, latestBuyPrice, latestSellPrice } = calculateRSIProfit(
				closingPrices,
				rsiData
			);
			const latestSignal =
				latestBuyPrice !== null
					? "buy"
					: latestSellPrice !== null
					? "sell"
					: null;
			const latestSignalPrice =
				latestBuyPrice !== null ? latestBuyPrice : latestSellPrice;
			return { profit, latestSignal, latestSignalPrice };
		}
		return { profit: 0, latestSignal: null, latestSignalPrice: null };
	};

	const calculateUMAP = (
		stockData: number[][],
		stockInfo: Record<string, StockData>
	): {
		x: number;
		y: number;
		symbol: string;
		close: number;
		color?: string;
	}[] => {
		try {
			if (!stockData || stockData.length === 0) {
				throw new Error("Stock data is empty");
			}

			const validData = stockData.filter(
				(arr) =>
					arr.length > 0 &&
					arr.every(
						(val) => typeof val === "number" && !isNaN(val) && isFinite(val)
					)
			);

			if (validData.length === 0) {
				throw new Error("No valid stock data found");
			}

			const minLength = Math.min(...validData.map((arr) => arr.length));
			const processedData = validData.map((arr) => arr.slice(0, minLength));

			const cleanedData = processedData.map((arr) =>
				arr.map((val) => (isNaN(val) || !isFinite(val) ? 0 : val))
			);

			const normalizedData = cleanedData.map((arr) => {
				const max = Math.max(...arr);
				const min = Math.min(...arr);
				return arr.map((val) => (val - min) / (max - min));
			});

			const umap = new UMAP({
				nComponents: 2,
				nNeighbors: Math.min(15, cleanedData.length - 1),
				minDist: 0.1,
				spread: 1,
				nEpochs: 200,
				random: Math.random,
				seed: 42,
			});
			const result = umap.fit(normalizedData);

			if (result.length === 0) {
				throw new Error("UMAP result is empty");
			}

			const chartData = Object.keys(stockInfo)
				.map((symbol, index) => {
					const point = result[index];
					const history = stockInfo[symbol].history;
					const latestDate = Object.keys(history).pop();
					const latestData = latestDate ? history[latestDate] : null;
					console.log(latestData);
					if (!latestData || typeof latestData.Close === "undefined") {
						console.error(`Missing latest price for symbol: ${symbol}`);
						return null;
					}

					// Calculate profit based on the selected indicator
					const { profit, latestSignal, latestSignalPrice } = calculateProfit(
						history,
						indicator
					);

					// Determine color based on the latest signal
					const color =
						latestSignal === "buy"
							? "rgba(0, 250, 50, 0.8)"
							: latestSignal === "sell"
							? "rgba(220, 20, 60, 0.8)" // Cooler red (Crimson)
							: "rgba(0, 122, 255, 0.6)"; // Default color for no signal

					return {
						x: point[0],
						y: point[1],
						symbol,
						name: availableStocks[symbol as keyof typeof availableStocks],
						latestPrice: latestData.Close,
						color,
						latestSignal,
						latestSignalPrice,
					};
				})
				.filter((point) => point !== null);

			console.log("Chart data:", chartData);
			return chartData.map((point) => ({
				x: point.x,
				y: point.y,
				symbol: point.symbol,
				close: point.latestPrice,
				color: point.color,
				latestSignal: point.latestSignal,
				latestSignalPrice: point.latestSignalPrice,
			}));
		} catch (error: unknown) {
			console.error("Error calculating UMAP:", error);
			if (error instanceof Error) {
				throw new Error(`UMAP calculation failed: ${error.message}`);
			} else {
				throw new Error("UMAP calculation failed: Unknown error");
			}
		}
	};

	const handleShowChart = async () => {
		setShowChart(true);
		await fetchData();
	};

	return (
		<Card className="w-full md:w-1/2 md:mx-auto">
			<CardHeader>
				<CardTitle>Wholistic Stock Visualization</CardTitle>
				<p className="text-sm text-muted-foreground">
					This chart uses UMAP (Uniform Manifold Approximation and Projection)
					to visualize stock similarities based on price movements.
				</p>
			</CardHeader>
			<CardContent className="flex flex-col items-center justify-center md:w-1/2 md:mx-auto">
				<Accordion type="single" collapsible className="w-full mb-4">
					<AccordionItem value="item-1">
						<AccordionTrigger>Tips</AccordionTrigger>
						<AccordionContent>
							<ul className="list-disc space-y-1 text-sm pl-5 text-justify">
								<li className="pl-1">
									Stocks clustered together have similar price patterns in the
									selected period
								</li>
								<li className="pl-1">
									Green dots indicate a buy signal for the selected indicator,
									red dots indicate a sell signal, and blue dots indicate no
									clear signal
								</li>

								<li className="pl-1">
									Hover over dots to see stock details and latest prices
								</li>
							</ul>
						</AccordionContent>
					</AccordionItem>
				</Accordion>

				{isLoading && (
					<p className="text-sm text-muted-foreground my-8">
						Calculating UMAP...
					</p>
				)}

				{error && <p className="text-red-500 mt-2">{error}</p>}
				{showChart && !isLoading && !error && (
					<div className="w-full aspect-square max-w-3xl mt-4">
						<canvas ref={chartRef} />
					</div>
				)}

				<div className="flex gap-4 mb-4 w-full">
					<div className="flex-1">
						<Select value={indicator} onValueChange={setIndicator}>
							<SelectTrigger id="indicator">
								<SelectValue placeholder="Select Indicator" />
							</SelectTrigger>
							<SelectContent position="popper">
								{indicatorOptions?.map(
									(option: { value: string; label: string }) => (
										<SelectItem key={option.value} value={option.value}>
											{option.label}
										</SelectItem>
									)
								)}
							</SelectContent>
						</Select>
					</div>
					<div className="flex-1">
						<Select value={period} onValueChange={setPeriod}>
							<SelectTrigger>
								<SelectValue placeholder="Select Period" />
							</SelectTrigger>
							<SelectContent>
								{periodOptions.map((option) => (
									<SelectItem key={option.value} value={option.value}>
										{option.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>
				<Button
					className="w-full"
					onClick={handleShowChart}
					disabled={isLoading}
				>
					{showChart ? "Update UMAP Chart" : "Show UMAP Chart"}
				</Button>
			</CardContent>
		</Card>
	);
}

export default UMAPChart;
