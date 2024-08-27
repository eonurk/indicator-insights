import StockChart from "@/components/charts/StockChart";
import IndicatorChecker from "@/components/charts/IndicatorChecker";
import { User } from "firebase/auth"; // Import User type
import { SiteHeader } from "@/components/site-header";
import { Link } from "react-router-dom";
import { SiteFooter } from "@/components/Footer";
import PricingTable from "@/components/PricingTable";
import NotificationBoard from "@/components/NotificationBoard";
import { useState } from "react";
import UMAPChart from "@/components/charts/UMAP-Chart";
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
		EMA: true,
		MACD: true,
		Bollinger: true,
	});

	const handleNotificationClick = (
		stock: string,
		period: string,
		indicator: string
	) => {
		setSelectedStock(stock);
		setSelectedPeriod(period);
		setSelectedIndicators((prev) => ({
			...Object.fromEntries(Object.keys(prev).map((key) => [key, false])),
			[indicator]: true,
		}));
	};

	return (
		<>
			<SiteHeader />

			<UMAPChart user={user} />
			{!user && (
				<div onClick={() => handleScroll("notification-board")}>
					<div className="h-[40rem] flex justify-center items-center px-4">
						<div className="text-2xl mx-auto font-normal text-neutral-600 dark:text-neutral-400">
							Get real-time insights with your favorite indicator
							<div className="text-4xl motion-safe:animate-bounce">&#8964;</div>
						</div>
					</div>
				</div>
			)}

			{user && <div className="m-8"></div>}

			<div
				id="notification-board"
				className="h-[40rem]"
				onClick={handleScroll("stock-chart")}
			>
				<NotificationBoard
					user={user}
					onNotificationClick={handleNotificationClick}
				/>{" "}
			</div>
			{!user && (
				<div className="h-[40rem] flex justify-center items-center px-4">
					<div className="text-2xl mx-auto font-normal text-neutral-600 dark:text-neutral-400">
						Would you make <span className="text-green-500">profit</span> or{" "}
						<span className="text-red-500">loss</span> in the stock market using
						indicators?
						<div className="text-4xl motion-safe:animate-bounce">&#8964;</div>
					</div>
				</div>
			)}
			{user && <div className="m-8"></div>}
			<div id="stock-chart">
				<StockChart
					user={user}
					selectedStock={selectedStock}
					selectedPeriod={selectedPeriod}
					selectedIndicators={selectedIndicators}
				/>
			</div>

			{!user && (
				<div className="h-[40rem] flex justify-center items-center px-4">
					<div className="text-2xl mx-auto font-normal text-neutral-600 dark:text-neutral-400">
						Can you check an indicator for all stocks?
						<div className="text-4xl motion-safe:animate-bounce">&#8964;</div>
					</div>
				</div>
			)}

			{user && <div className="m-8"></div>}
			<div className="h-[40rem]">
				<IndicatorChecker user={user} />
			</div>

			{!user && (
				<div className="h-[40rem] flex justify-center items-center px-4">
					<div className="text-2xl mx-auto font-normal text-neutral-600 dark:text-neutral-400">
						To check all NASDAQ stocks with more indicators
						<div className="text-4xl motion-safe:animate-bounce">&#8964;</div>
						<Link to="/signup">
							<PricingTable />
						</Link>
					</div>
				</div>
			)}

			<SiteFooter />
		</>
	);
}

export default Home;
