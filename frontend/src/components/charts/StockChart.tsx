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
import RMIChart from "@/components/charts/RMIChart";
import RSIChart from "@/components/charts/RSIChart";
import { stocks } from "@/utils/stocks";
import { User } from "firebase/auth";
import MACDChart from "@/components/charts/MACD-Chart";
import EMAChart from "@/components/charts/EMA-Chart";
import BollingerChart from "@/components/charts/BollingerBand-Chart";
import { Check } from "lucide-react";
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

// Add this function to generate the class for the checkbox based on its checked state
const checkboxClasses = (checked: boolean) =>
	`flex items-center p-2 rounded-lg transition-colors duration-300 ${
		checked ? "bg-blue-500 text-white" : "bg-slate-200 text-gray-700"
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

interface StockChartProps {
	user: User | null;
}

function StockChart({ user }: StockChartProps) {
	const [period, setPeriod] = useState<string>("1w");
	const [symbol, setSymbol] = useState<string>("AAPL");
	const [stockInfo, setStockInfo] = useState<{
		symbol: string;
		period: string;
		volume: string;
		avgVolume: string;
		marketCap: string;
		week52High: number;
		week52Low: number;
		peRatio: number;
		currentPrice: string | undefined;
		priceChangePercentage: string;
		lineColor: string;
		cardTitleColor: string;
		chartOptions: any;
		formattedData: any;
	} | null>(null);

	const [selectedIndicators, setSelectedIndicators] = useState({
		RMI: true,
		RSI: false,
		EMA: false,
		MACD: false,
		Bollinger: false,
	});

	const [indicatorPeriods, setIndicatorPeriods] = useState({
		RMI: { period: 14 },
		RSI: { period: 14 },
		EMA: { period: 14 },
		MACD: { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 },
		Bollinger: { period: 20, stdDev: 2 },
	});

	const [editingIndicator, setEditingIndicator] = useState<string | null>(null);

	const toggleIndicator = (key: string) => {
		setSelectedIndicators((prev) => ({
			...prev,
			[key]: !prev[key],
		}));
	};

	const availableStocks = user
		? stocks
		: {
				AAPL: "Apple Inc.",
				ABNB: "Airbnb, Inc.",
				AMZN: "Amazon.com, Inc.",
				EBAY: "eBay Inc.",
				GOOGL: "Alphabet Inc. (Class A)",
				META: "Meta Platforms, Inc.",
				NFLX: "Netflix, Inc.",
				PLTR: "Palantir Technologies Inc.",
				ZM: "Zoom Video Communications, Inc.",
		  };

	const getStockInfo = async (symbol: string, period: string) => {
		try {
			const fetchedData = await fetchStockData(symbol, period);
			const stockData = fetchedData[symbol];
			if (!stockData) {
				console.error("No data found for symbol:", symbol);
				return;
			}

			const history = stockData["history"];
			const dates = Object.keys(history).map((date) => new Date(date));
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
				peRatio: stockData["peRatio"] ? stockData["peRatio"].toFixed(2) : "-",
				currentPrice: latestPrice ? latestPrice.toFixed(2) : "-",
				priceChangePercentage: priceChangePercentage.toFixed(2),
				lineColor: lineColor,
				cardTitleColor: cardTitleColor,
				formattedData: {
					labels: dates,
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
				chartOptions: customChartOptions,
			});
		} catch (error) {
			console.error("Error fetching stock info:", error);
			if (error instanceof TypeError) {
				console.error("Network error:", error.message);
			}
		}
	};

	useEffect(() => {
		getStockInfo(symbol, period);
		const intervalId = setInterval(() => {
			getStockInfo(symbol, period);
		}, 60000);
		console.log("Updated periods:", indicatorPeriods);
		return () => clearInterval(intervalId);
	}, [symbol, period, selectedIndicators, indicatorPeriods]);

	return (
		<Card>
			<CardHeader className="items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
				<div className="flex-1 gap-1 text-center sm:text-left">
					<CardTitle>{stockInfo?.symbol}</CardTitle>
					<CardDescription className={stockInfo?.cardTitleColor}>
						${stockInfo?.currentPrice} ({stockInfo?.priceChangePercentage}%)
						<div className="flex gap-4">
							<div className="grid text-slate-400">
								<p>Volume: {stockInfo?.volume}</p>
								<p>Avg Volume: {stockInfo?.avgVolume}</p>
								<p>Market Cap: {stockInfo?.marketCap}</p>
							</div>
							<div className="grid text-slate-400">
								<p>P/E ratio: {stockInfo?.peRatio}</p>
								<p>52 Wk Low: {stockInfo?.week52Low}</p>
								<p>52 Wk High: {stockInfo?.week52High}</p>
							</div>
						</div>
					</CardDescription>
				</div>

				<div className="flex gap-2">
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
				</div>

				<ScrollArea className="w-64 whitespace-nowrap">
					<div className="flex gap-2">
						{Object.keys(selectedIndicators).map((key) => (
							<div key={key} className="flex items-center">
								<Checkbox
									id={key}
									checked={selectedIndicators[key]}
									onCheckedChange={() => toggleIndicator(key)}
									className="hidden"
								/>
								<div
									onClick={() => toggleIndicator(key)}
									className={checkboxClasses(selectedIndicators[key])}
								>
									{selectedIndicators[key] && <Check className="w-4 h-4" />}
									<span className="ml-2 text-sm font-medium">{key}</span>
								</div>
							</div>
						))}
					</div>
					<ScrollBar orientation="horizontal" />
				</ScrollArea>
			</CardHeader>

			<CardContent className="pt-6">
				{stockInfo && (
					<>
						<Line
							data={stockInfo.formattedData}
							options={stockInfo.chartOptions}
						/>
						<div className="flex justify-between items-center">
							<div className="flex gap-2"></div>
						</div>

						{Object.keys(selectedIndicators).map((key) =>
							selectedIndicators[key] ? (
								<div key={key} className="mt-4">
									{indicators.map(
										({
											key: indicatorKey,
											component: IndicatorComponent,
											periodKey,
											periodKeys,
										}) =>
											indicatorKey === key ? (
												<>
													<IndicatorComponent
														key={indicatorKey}
														formattedData={stockInfo.formattedData}
														{...indicatorPeriods[key]}
														options={stockInfo.chartOptions}
													/>
													<Button
														key={`${indicatorKey}-settings`}
														variant="ghost"
														size="sm"
														onClick={() => setEditingIndicator(key)}
													>
														⚙️ {indicatorKey} Settings
													</Button>
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
					periods={indicatorPeriods[editingIndicator]}
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
	periods: any;
	onClose: () => void;
	onSave: (newPeriods: any) => void;
}

function IndicatorSettings({
	indicator,
	periods,
	onClose,
	onSave,
}: IndicatorSettingsProps) {
	const [newPeriods, setNewPeriods] = useState(periods);

	const handleInputChange = (key: string, value: number) => {
		setNewPeriods((prev: any) => ({
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
					{Object.entries(periods).map(([key, value]) => (
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
