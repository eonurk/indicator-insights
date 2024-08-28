import StockChart from "@/components/charts/StockChart";
import IndicatorChecker from "@/components/charts/IndicatorChecker";
import { User } from "firebase/auth"; // Import User type
import { SiteHeader } from "@/components/site-header";
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
			{!user && (
				<div onClick={() => handleScroll("umap-board")}>
					<div className="h-[40rem] flex justify-center items-center px-4">
						<div className="text-2xl mx-auto font-normal text-neutral-600 dark:text-neutral-400">
							Introducing Holistic Stock Vizualization
							<div className="text-4xl motion-safe:animate-bounce">&#8964;</div>
						</div>
					</div>
				</div>
			)}

			<div id="umap-board">
				<UMAPChart user={user} />
			</div>

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
				onClick={() => handleScroll("stock-chart")}
			>
				<NotificationBoard
					user={user}
					onNotificationClick={handleNotificationClick}
				/>{" "}
			</div>
			{!user && (
				<div className="h-[40rem] flex justify-center items-center px-4">
					<div className="text-2xl md:w-2/3 mx-auto font-normal text-neutral-600 dark:text-neutral-400">
						Analyze stock performance with powerful indicators to spot
						<span className="text-green-500">
							{" "}
							profitable opportunities
						</span>{" "}
						and
						<span className="text-red-500"> potential risks</span>
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
						Check an indicator for all stocks
						<div className="text-4xl motion-safe:animate-bounce">&#8964;</div>
					</div>
				</div>
			)}

			{user && <div className="m-8"></div>}
			<div className="h-[40rem]">
				<IndicatorChecker user={user} />
			</div>
			{user && <div className="m-8"></div>}
			{!user && (
				<div className=" flex justify-center items-center px-4 my-8">
					<div className="text-2xl mx-auto font-normal text-neutral-600 dark:text-neutral-400">
						Get access to more indicators and features
						<div className="text-4xl motion-safe:animate-bounce my-4">
							&#8964;
						</div>
						<PricingTable />
					</div>
				</div>
			)}

			<SiteFooter />
		</>
	);
}

export default Home;
