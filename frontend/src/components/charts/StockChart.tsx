import { useState, useEffect } from "react";
import { fetchStockData, getPercentChange } from "@/fetchStockData";
import { format } from "date-fns";
import { formatNumber } from "@/utils/formatting";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import { ChartData, ChartOptions } from "chart.js";
import { CartesianScaleTypeRegistry, ScaleOptionsByType } from "chart.js";

import { chartOptions } from "@/components/charts/chartOptions";
import {
	CategoryScale,
	Chart as ChartJS,
	BarElement,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	TimeSeriesScale,
} from "chart.js";

import RiskWeather from "@/components/RiskWeather";

import RMIChart from "@/components/charts/RMIChart";
import RSIChart from "@/components/charts/RSIChart";
import MACDChart from "@/components/charts/MACD-Chart";
import SMAChart from "@/components/charts/SMA-Chart";
import EMAChart from "@/components/charts/EMA-Chart";
import BollingerChart from "@/components/charts/BollingerBand-Chart";

import { Check, DownloadIcon } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { saveAs } from "file-saver";
import { useRef } from "react";

// Add this function to generate the class for the checkbox based on its checked state
const checkboxClasses = (checked: boolean) =>
	`flex items-center p-2 rounded-lg transition-colors duration-300 ${
		checked ? "bg-blue-600 text-white" : "bg-slate-200 text-gray-700"
	} hover:bg-blue-500`;

ChartJS.register(
	BarElement,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	TimeSeriesScale
);

const periodOptions = [
	{ value: "1d", label: "1 Day" },
	{ value: "1w", label: "1 Week" },
	{ value: "1m", label: "1 Month" },
	{ value: "3m", label: "3 Months" },
	{ value: "ytd", label: "Year to Date" },
	{ value: "1y", label: "1 Year" },
	{ value: "all", label: "All" },
];

const indicators = [
	{ key: "RMI", component: RMIChart, periodKey: "period" },
	{ key: "RSI", component: RSIChart, periodKey: "period" },
	{
		key: "EMA",
		component: EMAChart,
		periodKeys: ["period"],
	},
	{
		key: "SMA",
		component: SMAChart,
		periodKeys: ["period"],
	},

	{
		key: "MACD",
		component: MACDChart,
		periodKeys: ["fastPeriod", "slowPeriod", "signalPeriod"],
	},
	{
		key: "Bollinger",
		component: BollingerChart,
		periodKeys: ["period", "stdDev"],
	},
];

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

interface StockChartProps {
	selectedStock: string;
	selectedPeriod: string;
	selectedIndicators: Record<string, boolean>;
	availableStocks: Record<string, string>;
}

interface HistoryData {
	history: Record<string, { [key: string]: number }>;
	volume: number;
	avgVolume: number;
	marketCap: number;
	week52High: number;
	week52Low: number;
	peRatio: string;
}

type GenericChartOptions = Omit<ChartOptions<"line">, "scales"> & {
	scales?: {
		[key: string]: ScaleOptionsByType<keyof CartesianScaleTypeRegistry>;
	};
};

function StockChart({
	selectedStock,
	selectedPeriod,
	selectedIndicators: initialSelectedIndicators,
	availableStocks,
}: StockChartProps) {
	const [symbol, setSymbol] = useState(selectedStock);
	const [period, setPeriod] = useState(selectedPeriod);
	const [portfolioRisk, setPortfolioRisk] = useState(0);

	const [stockInfo, setStockInfo] = useState<{
		symbol: string;
		period: string;
		volume: string;
		avgVolume: string;
		marketCap: string;
		week52High: number;
		week52Low: number;
		peRatio: string;
		currentPrice: string | undefined;
		priceChangePercentage: string;
		lineColor: string;
		cardTitleColor: string;
		chartOptions: ChartOptions;
		formattedData: ChartData<"line", DataPoint[]>;
	} | null>(null);

	const [selectedIndicators, setSelectedIndicators] = useState(() => ({
		...initialSelectedIndicators,
	}));

	const [indicatorPeriods, setIndicatorPeriods] = useState({
		RMI: { period: 14 },
		RSI: { period: 14 },
		EMA: { period: 14 },
		SMA: { period: 14 },
		MACD: { fastPeriod: 26, slowPeriod: 12, signalPeriod: 9 },
		Bollinger: { period: 20, stdDev: 2 },
	});

	const [editingIndicator, setEditingIndicator] = useState<string | null>(null);

	const chartRef = useRef<ChartJS<"line", DataPoint[], unknown>>(null);

	const downloadChart = (
		chartRef: React.RefObject<
			ChartJS<"line", DataPoint[], unknown>
		> | null = null
	) => {
		if (chartRef && chartRef.current) {
			const url = chartRef.current.toBase64Image();
			saveAs(url, `${symbol}-${period}.png`);
		} else {
			// Download all indicator charts
			Object.keys(selectedIndicators).forEach((key) => {
				if (selectedIndicators[key as keyof typeof selectedIndicators]) {
					const indicatorChartRef = document.querySelector(
						`#${key}-chart`
					) as HTMLCanvasElement;
					if (indicatorChartRef) {
						const url = indicatorChartRef.toDataURL("image/png");
						saveAs(url, `${symbol}-${period}-${key}.png`);
					}
				}
			});
		}
	};
	const toggleIndicator = (key: string) => {
		setSelectedIndicators((prev) => ({
			...prev,
			[key as keyof typeof selectedIndicators]:
				!prev[key as keyof typeof selectedIndicators],
		}));
	};

	const getStockInfo = async (symbol: string, period: string) => {
		try {
			const fetchedData = (await fetchStockData(symbol, period)) as Record<
				string,
				HistoryData
			>;
			const stockData = fetchedData[symbol];
			if (!stockData) {
				console.error("No data found for symbol:", symbol);
				return;
			}

			const history = stockData["history"];
			const dates = Object.keys(history).map((date) => new Date(date));
			// Ensure dates is always defined
			if (dates.length === 0) return;

			const closingPrices = dates
				.map((date) => history[format(date, "yyyy-MM-dd HH:mm:ss")]?.Close)
				.filter((price) => price !== undefined) as number[];

			const latestPrice = closingPrices[closingPrices.length - 1];
			const priceChangePercentage = getPercentChange(closingPrices);
			const lineColor = priceChangePercentage < 0 ? "red" : "#19e64d";
			const cardTitleColor =
				priceChangePercentage < 0 ? "text-red-500" : "text-green-500";

			let customChartOptions = chartOptions(period);
			customChartOptions = {
				...customChartOptions,
			};

			setStockInfo({
				symbol,
				period,
				volume: formatNumber(stockData["volume"]),
				avgVolume: formatNumber(stockData["avgVolume"]),
				marketCap: formatNumber(stockData["marketCap"]),
				week52High: stockData["week52High"],
				week52Low: stockData["week52Low"],
				peRatio: stockData["peRatio"] ? stockData["peRatio"].toString() : "-",
				currentPrice: latestPrice ? latestPrice.toFixed(2) : "-",
				priceChangePercentage: priceChangePercentage.toFixed(2),
				lineColor: lineColor,
				cardTitleColor: cardTitleColor,
				formattedData: {
					labels: dates as Date[], // Ensure labels is always defined as Date[]
					datasets: [
						{
							label: symbol,
							data: closingPrices.map((price, index) => ({
								x: dates[index],
								y: price,
							})),
							borderColor: lineColor,
							borderWidth: 2,
							backgroundColor: lineColor,
							fill: false,
							tension: 0.1,
						},
					],
				},
				chartOptions: customChartOptions as ChartOptions,
			});
		} catch (error) {
			console.error("Error fetching stock info:", error);
			if (error instanceof TypeError) {
				console.error("Network error:", error.message);
			}
		}
	};

	useEffect(() => {
		setSymbol(selectedStock);
	}, [selectedStock]);

	useEffect(() => {
		setPeriod(selectedPeriod);
	}, [selectedPeriod]);

	useEffect(() => {
		getStockInfo(symbol, period);
		const intervalId = setInterval(() => {
			getStockInfo(symbol, period);
		}, 60000);
		return () => clearInterval(intervalId);
	}, [symbol, period]);

	useEffect(() => {
		// Calculate portfolio risk based on selected indicators and stock data
		const calculateRisk = () => {
			if (!stockInfo) return 0;
			const latestPrice =
				stockInfo.formattedData.datasets[0].data[
					stockInfo.formattedData.datasets[0].data.length - 1
				].y;
			const averagePrice =
				stockInfo.formattedData.datasets[0].data.reduce(
					(sum, point) => sum + point.y,
					0
				) / stockInfo.formattedData.datasets[0].data.length;
			const volatility = Math.abs(latestPrice - averagePrice) / averagePrice;
			return Math.min(volatility * 100, 100); // Scale to 0-100
		};
		setPortfolioRisk(calculateRisk());
	}, [stockInfo]);

	return (
		<Card className="w-full md:w-2/3 md:mx-auto">
			<CardHeader className="items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
				<div className="flex-1 gap-2 text-center sm:text-left">
					<CardTitle>{stockInfo?.symbol}</CardTitle>

					<CardDescription className={stockInfo?.cardTitleColor}>
						${stockInfo?.currentPrice} ({stockInfo?.priceChangePercentage}%)
						<div className="flex gap-4">
							<div className="grid text-slate-400">
								<p>Volume: {stockInfo?.volume}</p>
								<p>Avg Volume: {stockInfo?.avgVolume}</p>
								<p>Market Cap: {stockInfo?.marketCap}</p>
							</div>
							<div className="grid text-slate-400 ">
								<p>P/E ratio: {stockInfo?.peRatio}</p>
								<p>52 Wk Low: {stockInfo?.week52Low}</p>
								<p>52 Wk High: {stockInfo?.week52High}</p>
							</div>
						</div>
					</CardDescription>
				</div>

				<div className="flex-1 gap-1 max-w-64 flex flex-col">
					<Select value={symbol} onValueChange={setSymbol}>
						<SelectTrigger
							className="flex min-w-32 rounded-lg sm:ml-auto"
							aria-label="Select a value"
						>
							<SelectValue placeholder="AAPL" />
						</SelectTrigger>
						<SelectContent position="popper">
							{Object.entries(availableStocks).map(([id, name]) => (
								<SelectItem key={id} value={id}>
									{name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Select value={period} onValueChange={setPeriod}>
						<SelectTrigger
							className="flex min-w-32 rounded-lg sm:ml-auto"
							aria-label="Select a value"
						>
							<SelectValue placeholder="1 Week" />
						</SelectTrigger>
						<SelectContent position="popper">
							{periodOptions.map(({ value, label }) => (
								<SelectItem key={value} value={value}>
									{label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<ScrollArea className="w-full whitespace-nowrap">
						<div className="flex gap-1">
							{Object.keys(selectedIndicators).map((key) => (
								<div key={key} className="flex items-center">
									<Checkbox
										id={key}
										checked={
											selectedIndicators[key as keyof typeof selectedIndicators]
										}
										onCheckedChange={() => toggleIndicator(key)}
										className="hidden"
									/>
									<div
										onClick={() => toggleIndicator(key)}
										className={checkboxClasses(
											selectedIndicators[key as keyof typeof selectedIndicators]
										)}
									>
										{selectedIndicators[
											key as keyof typeof selectedIndicators
										] && <Check className="w-4 h-4" />}
										<span className="ml-2 text-sm font-medium">{key}</span>
									</div>
								</div>
							))}
						</div>
						<ScrollBar orientation="horizontal" />
					</ScrollArea>
				</div>
			</CardHeader>

			<CardContent className="pt-4">
				{stockInfo && (
					<>
						<div className="flex justify-end items-center">
							<RiskWeather portfolioRisk={portfolioRisk} />
						</div>
						<Line
							ref={chartRef}
							data={stockInfo.formattedData as ChartData<"line", DataPoint[]>}
							options={stockInfo.chartOptions as ChartOptions<"line">}
						/>

						<div className="flex justify-end items-center">
							<div className="flex gap-2">
								<Button
									onClick={() => downloadChart(chartRef)}
									variant="ghost"
									size="sm"
								>
									<DownloadIcon className="w-4 h-4 mr-2" /> Download Chart
								</Button>
							</div>
						</div>
						<Separator />
						{Object.keys(selectedIndicators).map((key) =>
							selectedIndicators[key as keyof typeof selectedIndicators] ? (
								<div key={key}>
									{indicators.map(
										({ key: indicatorKey, component: IndicatorComponent }) =>
											indicatorKey === key ? (
												<>
													<IndicatorComponent
														key={indicatorKey}
														formattedData={
															stockInfo.formattedData as FormattedChartData
														}
														{...indicatorPeriods[
															key as keyof typeof indicatorPeriods
														]}
														options={
															stockInfo.chartOptions as GenericChartOptions
														}
													/>
													<div className="flex justify-end items-center mt-1">
														{/* <Button
															onClick={() => downloadChart(chartRef)}
															className="flex justify-end items-center"
															variant="ghost"
															size="sm"
														>
															<DownloadIcon className="w-4 h-4" />
														</Button> */}

														<Button
															key={`${indicatorKey}-settings`}
															variant="ghost"
															size="sm"
															onClick={() => setEditingIndicator(key)}
														>
															⚙️ {indicatorKey} Settings
														</Button>
													</div>
													<Separator />
												</>
											) : null
									)}
								</div>
							) : null
						)}
					</>
				)}
			</CardContent>

			{editingIndicator && (
				<IndicatorSettings
					indicator={editingIndicator}
					periods={
						indicatorPeriods[editingIndicator as keyof typeof indicatorPeriods]
					}
					onClose={() => setEditingIndicator(null)}
					onSave={(newPeriods) => {
						setIndicatorPeriods((prev) => ({
							...prev,
							[editingIndicator]: newPeriods,
						}));
						setEditingIndicator(null);
					}}
				/>
			)}
		</Card>
	);
}

interface IndicatorSettingsProps {
	indicator: string;
	periods: { [key: string]: number };
	onClose: () => void;
	onSave: (newPeriods: { [key: string]: number }) => void;
}

function IndicatorSettings({
	indicator,
	periods,
	onClose,
	onSave,
}: IndicatorSettingsProps) {
	const [newPeriods, setNewPeriods] = useState(periods);

	const handleInputChange = (key: string, value: number) => {
		setNewPeriods((prev: { [key: string]: number }) => ({
			...prev,
			[key]: value,
		}));
	};

	return (
		<Dialog open={true} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{indicator} Settings</DialogTitle>
				</DialogHeader>
				<div className="py-4">
					{Object.entries(periods).map(([key]) => (
						<div key={key} className="mb-4">
							<label
								htmlFor={key}
								className="block text-sm font-medium text-gray-700"
							>
								{key.charAt(0).toUpperCase() + key.slice(1)}
							</label>
							<Input
								type="number"
								id={key}
								value={newPeriods[key]}
								onChange={(e) =>
									handleInputChange(key, parseInt(e.target.value))
								}
								className="mt-1"
							/>
						</div>
					))}
				</div>
				<DialogFooter>
					<Button onClick={onClose} variant="outline">
						Cancel
					</Button>
					<Button onClick={() => onSave(newPeriods)}>Save</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default StockChart;
