import { User } from "firebase/auth";
import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	getAvailableIndices,
	getCompaniesByIndex,
	getDefaultCompanies,
} from "@/utils/marketData";

import AIStockAnalysis from "@/components/charts/AIStockAnalysisProps";
import SankeyChart from "@/components/charts/SankeyChart";
import StockChart from "@/components/charts/StockChart";
import IndicatorChecker from "@/components/charts/BacktestAll";
import NotificationBoard from "@/components/charts/NotificationBoard";
import UMAPChart from "@/components/charts/UMAP-Chart";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { Icons } from "../icons";

export function Dashboard({ user }: { user: User | null }) {
	const [selectedStock, setSelectedStock] = useState("AAPL");
	const [selectedPeriod, setSelectedPeriod] = useState("1m");
	const [selectedIndicators, setSelectedIndicators] = useState({
		RMI: true,
		RSI: false,
		SMA: false,
		EMA: false,
		MACD: false,
		Bollinger: true,
		StochRSI: true,
	});

	const [selectedIndex, setSelectedIndex] = useState("S&P 100");
	const [availableIndices, setAvailableIndices] = useState<string[]>([]);
	const [availableStocks, setAvailableStocks] = useState<
		Record<string, string>
	>({});

	const [activeTab, setActiveTab] = useState("overview");

	const areArraysEqual = useCallback(
		(arr1: string[], arr2: string[]): boolean => {
			if (arr1.length !== arr2.length) return false;
			return arr1.every((value, index) => value === arr2[index]);
		},
		[]
	);

	useEffect(() => {
		const fetchData = async () => {
			if (!user) {
				const defaultStocks = getDefaultCompanies();
				if (
					!areArraysEqual(
						Object.keys(availableStocks),
						Object.keys(defaultStocks)
					)
				) {
					setAvailableStocks(defaultStocks);
					if (!Object.keys(defaultStocks).includes(selectedStock)) {
						setSelectedStock(Object.keys(defaultStocks)[0]);
					}
				}
			} else {
				if (availableIndices.length === 0) {
					const indices = await getAvailableIndices();
					setAvailableIndices(indices);
				}
				const stocks = await getCompaniesByIndex(selectedIndex);
				if (
					!areArraysEqual(Object.keys(availableStocks), Object.keys(stocks))
				) {
					setAvailableStocks(stocks);
					if (!stocks[selectedStock]) {
						setSelectedStock(Object.keys(stocks)[0]);
					}
				}
			}
		};

		fetchData();
	}, [
		user,
		selectedIndex,
		availableIndices.length,
		availableStocks,
		selectedStock,
		areArraysEqual,
	]);

	const handleNotificationClick = useCallback(
		(stock: string, period: string, indicator: string) => {
			setSelectedStock(stock);
			setSelectedPeriod(period);
			setSelectedIndicators({
				RMI: indicator === "RMI",
				RSI: indicator === "RSI",
				SMA: indicator === "SMA",
				EMA: indicator === "EMA",
				MACD: indicator === "MACD",
				Bollinger: indicator === "Bollinger",
				StochRSI: indicator === "StochRSI",
			});
		},
		[]
	);

	return (
		<div className=" p-0">
			{user && (
				<div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-lg shadow-md flex flex-col items-center">
					<Label className="text-white text-lg font-semibold">
						Select an index
					</Label>
					<p className="text-white text-xs mb-2">
						As a Pro user, you have access to multiple stock indices.
					</p>
					<Select value={selectedIndex} onValueChange={setSelectedIndex}>
						<SelectTrigger className="w-[200px] bg-white text-gray-800">
							<SelectValue placeholder="Select an index" />
						</SelectTrigger>
						<SelectContent>
							{availableIndices.map((option) => (
								<SelectItem key={option} value={option}>
									{option}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<p className="text-xs text-white opacity-80 text-center">
						<br />
						<span className="inline-flex items-center gap-2">
							<Icons.info />
							<span className="text-white text-xs opacity-80 ">
								Only the stocks of the selected index are shown. It might take a
								few seconds to load.
							</span>
						</span>
					</p>
				</div>
			)}

			<Tabs
				value={activeTab}
				onValueChange={setActiveTab}
				className="space-y-4 my-4"
			>
				<TabsList>
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="analysis">Analysis</TabsTrigger>
					<TabsTrigger value="market">Market View</TabsTrigger>
				</TabsList>

				<div
					className={`space-y-4 ${
						activeTab === "overview" ? "block" : "hidden"
					}`}
				>
					<div className="flex flex-col">
						<div className="">
							<ScrollArea className="p-0">
								<NotificationBoard
									onNotificationClick={(stock, period, indicator) => {
										handleNotificationClick(stock, period, indicator);
										document
											.getElementById("stock-chart")
											?.scrollIntoView({ behavior: "smooth" });
									}}
									availableStocks={availableStocks}
								/>
							</ScrollArea>
						</div>

						<div id="stock-chart" className="p-0 my-4">
							<StockChart
								selectedStock={selectedStock}
								selectedPeriod={selectedPeriod}
								selectedIndicators={selectedIndicators}
								availableStocks={availableStocks}
							/>
						</div>
					</div>
				</div>

				<div
					className={`space-y-4 ${
						activeTab === "analysis" ? "block" : "hidden"
					}`}
				>
					<div className="">
						<AIStockAnalysis
							user={user}
							selectedStock={selectedStock}
							selectedPeriod={selectedPeriod}
							availableStocks={availableStocks}
						/>

						<div className="my-4"></div>

						<IndicatorChecker user={user} />

						<div className="my-4"></div>

						<UMAPChart user={user} />
					</div>
				</div>

				<div
					className={`space-y-4 ${activeTab === "market" ? "block" : "hidden"}`}
				>
					<div>
						<SankeyChart
							selectedStock={selectedStock}
							availableStocks={availableStocks}
						/>
					</div>
				</div>
			</Tabs>
		</div>
	);
}

export default Dashboard;
