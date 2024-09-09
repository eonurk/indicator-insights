import StockChart from "@/components/charts/StockChart";
import IndicatorChecker from "@/components/charts/BacktestAll";
import { User } from "firebase/auth"; // Import User type
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import FAQHome from "@/components/FAQHome";
import PricingTable from "@/components/PricingTable";
import NotificationBoard from "@/components/charts/NotificationBoard";
import { useState, useEffect, useCallback } from "react";
import UMAPChart from "@/components/charts/UMAP-Chart";
import { motion } from "framer-motion";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	getAvailableIndices,
	getCompaniesByIndex,
	getDefaultCompanies,
} from "@/utils/marketData";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Icons } from "@/components/icons";
import AIStockAnalysis from "@/components/charts/AIStockAnalysisProps";
import SankeyChart from "@/components/charts/SankeyChart";

<script async src="https://js.stripe.com/v3/pricing-table.js"></script>;

interface StockChartProps {
	user: User | null; // Use User type from firebase/auth
}

const handleScroll = (target: string) => {
	// Using `document.getElementById` to find the scroll target
	const section = document.getElementById(target);
	if (section) {
		// Scroll smoothly to the target section
		section.scrollIntoView({ behavior: "smooth" });
	}
};

export function Home({ user }: StockChartProps) {
	const [selectedStock, setSelectedStock] = useState("AAPL");
	const [selectedPeriod, setSelectedPeriod] = useState("1m");
	const [selectedIndicators, setSelectedIndicators] = useState({
		RMI: true,
		RSI: true,
		SMA: true,
		EMA: false,
		MACD: false,
		Bollinger: false,
	});

	const [selectedIndex, setSelectedIndex] = useState("S&P 100");
	const [availableIndices, setAvailableIndices] = useState<string[]>([]);
	const [availableStocks, setAvailableStocks] = useState<
		Record<string, string>
	>({});

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
			});
		},
		[]
	);

	return (
		<>
			<SiteHeader />
			{!user && <HeroSection />}

			<div className="container mx-auto px-0">
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
									Only the stocks of the selected index are shown. It might take
									a few seconds to load.
								</span>
							</span>
						</p>
					</div>
				)}

				<section id="ai-stock-analysis" className="pb-20 pt-10 relative">
					<AIStockAnalysis
						user={user || null}
						selectedStock={selectedStock}
						selectedPeriod={selectedPeriod}
						availableStocks={availableStocks}
					/>
				</section>

				{/* Get real time insights on your stocks */}
				{!user && (
					<motion.div
						className="text-center text-3xl font-bold"
						initial={{ opacity: 0, y: 50 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.3 }}
						transition={{ duration: 0.8, ease: "easeOut" }}
					>
						<motion.span
							className="inline-block"
							initial={{ rotateX: -90 }}
							whileInView={{ rotateX: 0 }}
							transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
						>
							🚀
						</motion.span>
						<motion.span
							className="inline-block ml-2 bg-clip-text text-4xl text-transparent bg-gradient-to-r from-green-400 to-blue-500"
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							transition={{ delay: 0.5, duration: 0.8 }}
						>
							Real-time Stock Insights
						</motion.span>
						<motion.span
							whileInView={{ opacity: 1, x: 0 }}
							initial={{ opacity: 0, x: -50 }}
							className="block mt-2 text-lg font-medium text-muted-foreground"
							transition={{ delay: 0.8, duration: 0.8 }}
						>
							Get notified instantly when a specific indicator reaches a
							specific level
						</motion.span>
					</motion.div>
				)}

				<section id="notification-board" className="pb-10 pt-10 relative">
					<NotificationBoard
						onNotificationClick={(stock, period, indicator) => {
							handleNotificationClick(stock, period, indicator);
							handleScroll("stock-chart");
						}}
						availableStocks={availableStocks}
					/>
					{!user && (
						<div className="relative sm:w-2/3 h-full max-w-screen-xl mx-auto">
							<p className="z-10 text-sm font-xs text-gray-100 px-1 py-1 bg-gray-400 rounded transition-all duration-300">
								Click on an insight to explore more
							</p>
						</div>
					)}
				</section>

				{!user && (
					<section className="pt-20 text-center overflow-hidden">
						<motion.h2
							initial={{ opacity: 0, y: -20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.8 }}
							className="text-4xl md:text-4xl md:w-3/4 lg:w-2/3 mx-auto font-semibold text-foreground"
						>
							Unlock Market Insights with Powerful Analytics
						</motion.h2>
						<motion.p
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.8, delay: 0.2 }}
							className="mt-4 text-xl md:w-2/3 mx-auto text-muted-foreground"
						>
							Analyze stock performance using advanced indicators to identify
							{/* add cards with icons and text: talk about using indicators to identify trends and make trading decisions */}
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10  text-black">
								<div className="bg-white p-4 rounded-lg shadow-md ">
									<div className="flex items-center justify-center">
										<Icons.trendingUp className="w-12 h-12 text-blue-500 mb-4" />
									</div>
									<span className="text-xl font-bold">Identify Trends</span>
									<p className="text-muted-foreground text-sm">
										Use indicators to identify trends and make informed trading
										decisions.
									</p>
								</div>
								<div className="bg-white p-4 rounded-lg shadow-md">
									<div className="flex items-center justify-center">
										<Icons.pieChart className="w-12 h-12 text-green-500 mb-4" />
									</div>
									<span className="text-xl font-bold">Analyze Performance</span>
									<p className="text-muted-foreground text-sm">
										Track stock performance over time to gauge market movements
										and make informed trading decisions.
									</p>
								</div>
								<div className="bg-white p-4 rounded-lg shadow-md">
									<div className="flex items-center justify-center">
										<Icons.barChart className="w-12 h-12 text-teal-500 mb-4" />
									</div>
									<span className="text-xl font-bold">Optimize Strategies</span>
									<p className="text-muted-foreground text-sm">
										Leverage data to optimize your trading strategies for better
										outcomes.
									</p>
								</div>
							</div>
						</motion.p>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.8, delay: 0.6 }}
							className="mt-8"
						></motion.div>
						<motion.div
							className="text-5xl mt-6"
							initial={{ y: 0 }}
							whileInView={{ y: [0, -10, 0] }}
							viewport={{ once: true }}
							transition={{ repeat: Infinity, duration: 1.5 }}
						>
							&#8964;
						</motion.div>
					</section>
				)}

				<section id="stock-chart" className="pb-20 pt-10">
					<StockChart
						selectedStock={selectedStock}
						selectedPeriod={selectedPeriod}
						selectedIndicators={selectedIndicators}
						availableStocks={availableStocks}
					/>
				</section>

				{!user && (
					<section id="sankey-chart" className="pb-20 pt-10">
						<motion.div
							initial={{ opacity: 0, scale: 0.8 }}
							whileInView={{ opacity: 1, scale: 1 }}
							viewport={{ once: true, amount: 0.3 }}
							transition={{ duration: 0.8, ease: "easeOut" }}
						>
							<motion.h2
								className="text-4xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-blue-600"
								initial={{ x: -50 }}
								whileInView={{ x: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6, delay: 0.2 }}
							>
								Dive into Stock Financials
							</motion.h2>
							<motion.p
								className="mt-4 text-xl text-muted-foreground"
								initial={{ x: 50 }}
								whileInView={{ x: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6, delay: 0.4 }}
							>
								Uncover the financial heartbeat of your favorite stocks
							</motion.p>
						</motion.div>
					</section>
				)}

				<SankeyChart
					selectedStock={selectedStock}
					availableStocks={availableStocks}
				/>

				{!user && (
					<motion.section
						className="pt-20 text-center"
						initial={{ opacity: 0, y: 50 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.3 }}
						transition={{ duration: 0.7 }}
					>
						<motion.h2
							className="text-4xl font-semibold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: 0.2 }}
						>
							Discover Market-Wide Insights
						</motion.h2>
						<motion.p
							className="mt-4 text-xl text-muted-foreground"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: 0.4 }}
						>
							Analyze indicators across all stocks simultaneously
						</motion.p>
						<motion.div
							className="text-5xl mt-6 text-blue-500"
							initial={{ y: 0 }}
							whileInView={{ y: [0, -10, 0] }}
							viewport={{ once: true }}
							transition={{ repeat: Infinity, duration: 1.5 }}
						>
							&#8964;
						</motion.div>
					</motion.section>
				)}

				<section className="pb-20 pt-10 ">
					<IndicatorChecker user={user} />
				</section>

				{!user && (
					<motion.section
						className="pt-20 text-center cursor-pointer transform hover:scale-105 transition-all duration-300"
						onClick={() => handleScroll("umap-board")}
						initial={{ opacity: 0, y: 50 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.3 }}
						transition={{ duration: 0.7 }}
					>
						<motion.h2
							className="text-4xl font-semibold text-gradient bg-clip-text"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: 0.2 }}
						>
							{/* This section highlights the new feature that allows users to explore the entire market, providing them with comprehensive insights and data. */}
							Explore the Entire Market <br />
							<motion.span
								className="inline-block bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold mt-2 animate-pulse"
								initial={{ scale: 0 }}
								whileInView={{ scale: 1 }}
								viewport={{ once: true }}
								transition={{ delay: 0.7, type: "spring", stiffness: 500 }}
							>
								NEW
							</motion.span>
						</motion.h2>
						<motion.div
							className="text-5xl mt-6"
							initial={{ y: 0 }}
							whileInView={{ y: [0, -10, 0] }}
							viewport={{ once: true }}
							transition={{ repeat: Infinity, duration: 1.5 }}
						>
							&#8964;
						</motion.div>
					</motion.section>
				)}

				<section id="umap-board" className="pb-20 pt-10 ">
					<UMAPChart user={user} />
				</section>

				{!user && (
					<motion.section
						className="pt-20 text-center"
						initial={{ opacity: 0, y: 50 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.3 }}
						transition={{ duration: 0.7 }}
					>
						<motion.h2
							className="text-4xl md:text-4xl font-semibold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 mb-6"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: 0.2 }}
						>
							Unlock the Full Potential of Market Analysis
						</motion.h2>
						<motion.p
							className="text-xl text-muted-foreground mb-8"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: 0.4 }}
						>
							Gain access to advanced indicators and powerful features
						</motion.p>

						<motion.div
							className="flex justify-center pb-10"
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: 0.8 }}
						>
							<PricingTable />
						</motion.div>
					</motion.section>
				)}

				{!user && (
					<div className="text-center">
						<div className="relative flex justify-center text-sm uppercase mb-4">
							<span className="bg-background px-2 text-muted-foreground">
								Or
							</span>
						</div>
						<Link
							to="https://t.me/iisight"
							target="_blank"
							rel="noopener noreferrer"
							className="inline-block"
						>
							<Button
								variant="outline"
								className="text-slate-700 transition-colors py-8 px-8 text-base shadow-md flex items-center space-x-4 rounded-lg"
							>
								<Icons.telegram />
								<span className="sm:inline hidden">
									Join our Telegram for Free Daily Insights
								</span>
								<span className="sm:hidden inline text-sm">
									Join our Telegram <br />
									for Free Daily Insights
								</span>
							</Button>
						</Link>
					</div>
				)}
				{!user && <FAQHome />}

				<SiteFooter />
			</div>
		</>
	);
}

export default Home;
