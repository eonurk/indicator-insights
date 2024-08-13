import { useState, useEffect } from "react";
import { fetchStockData, getPercentChange } from "@/fetchStockData";
import { format } from "date-fns";
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
	CardFooter,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import { chartOptions } from "@/components/chartOptions";
import {
	CategoryScale,
	Chart as ChartJS,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	TimeSeriesScale,
} from "chart.js";

import RMIChart from "@/components/RMIChart";
import RSIChart from "@/components/RSIChart";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	TimeSeriesScale
);

const stockOptions = [
	{ id: "AAPL", name: "Apple" },
	{ id: "TXG", name: "10x Genomics" },
	{ id: "MSFT", name: "Microsoft" },
];

const periodOptions = [
	{ value: "1d", label: "1 Day" },
	{ value: "1w", label: "1 Week" },
	{ value: "1m", label: "1 Month" },
	{ value: "3m", label: "3 Months" },
	{ value: "ytd", label: "Year to Date" },
	{ value: "1y", label: "1 Year" },
	{ value: "all", label: "All" },
];

function StockChart() {
	const [period, setPeriod] = useState<string>("1w");
	const [symbol, setSymbol] = useState<string>("AAPL");
	const [stockInfo, setStockInfo] = useState<{
		symbol: string;
		period: string;
		currentPrice: string | undefined;
		priceChangePercentage: string;
		lineColor: string;
		cardTitleColor: string;
		chartOptions: any;
		formattedData: any;
	} | null>(null);

	// indicators
	const [showRSI, setShowRSI] = useState<boolean>(false);
	const [showRMI, setShowRMI] = useState<boolean>(false);

	const getStockInfo = async (symbol: string, period: string) => {
		try {
			const fetchedData = await fetchStockData(symbol, period);
			const history = fetchedData.history;
			const dates = Object.keys(history).map((date) => new Date(date));
			const closingPrices = dates
				.map((date) => history[format(date, "yyyy-MM-dd HH:mm:ss")]?.Close)
				.filter((price) => price !== undefined) as number[];

			const latestPrice = closingPrices[closingPrices.length - 1];
			const priceChangePercentage = getPercentChange(closingPrices);
			const lineColor = priceChangePercentage < 0 ? "red" : "#19e64d";
			const cardTitleColor =
				priceChangePercentage < 0 ? "text-red-500" : "text-green-500";

			setStockInfo({
				symbol,
				period,
				currentPrice: latestPrice ? latestPrice.toFixed(2) : undefined,
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
				chartOptions: chartOptions(period),
			});
		} catch (error) {
			console.error("Error fetching stock info:", error);
		}
	};

	useEffect(() => {
		getStockInfo(symbol, period);
	}, [symbol, period, showRMI, showRSI]);

	return (
		<Card>
			<CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
				<div className="grid flex-1 gap-1 text-center sm:text-left">
					<CardTitle>{stockInfo?.symbol}</CardTitle>
					<CardDescription className={stockInfo?.cardTitleColor}>
						${stockInfo?.currentPrice} ({stockInfo?.priceChangePercentage}%)
					</CardDescription>
				</div>

				<div className="flex gap-1">
					<Select value={symbol} onValueChange={setSymbol}>
						<SelectTrigger
							className="w-[160px] rounded-lg sm:ml-auto"
							aria-label="Select a value"
						>
							<SelectValue placeholder="AAPL" />
						</SelectTrigger>
						<SelectContent>
							{stockOptions.map((option) => (
								<SelectItem key={option.id} value={option.id}>
									{option.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Select value={period} onValueChange={setPeriod}>
						<SelectTrigger
							className="w-[160px] rounded-lg sm:ml-auto"
							aria-label="Select a value"
						>
							<SelectValue placeholder="1w" />
						</SelectTrigger>
						<SelectContent position="popper">
							{periodOptions.map((option) => (
								<SelectItem key={option.value} value={option.value}>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="flex gap-2">
					<Checkbox
						id="RMI"
						checked={showRMI}
						onCheckedChange={() => setShowRMI((prev) => !prev)}
					/>
					<label
						className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						htmlFor="RMI"
					>
						RMI
					</label>

					<Checkbox
						id="RSI"
						checked={showRSI}
						onCheckedChange={() => setShowRSI((prev) => !prev)}
					/>

					<div className="grid gap-1.5 leading-none">
						<label
							htmlFor="RSI"
							className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							RSI
						</label>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				{stockInfo && (
					<>
						<Line
							data={stockInfo.formattedData}
							options={stockInfo.chartOptions}
						/>

						{showRMI && (
							<RMIChart
								formattedData={stockInfo.formattedData}
								RMIperiod={14}
								options={stockInfo.chartOptions}
							/>
						)}
						{showRSI && (
							<RSIChart
								formattedData={stockInfo.formattedData}
								RSIperiod={14} // [TODO]: Allow users to select indicator periods
								options={stockInfo.chartOptions}
							/>
						)}
					</>
				)}
			</CardContent>
			<CardFooter></CardFooter>
		</Card>
	);
}

export default StockChart;
