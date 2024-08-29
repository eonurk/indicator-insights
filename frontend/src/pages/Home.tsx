import StockChart from "@/components/charts/StockChart";
import IndicatorChecker from "@/components/charts/IndicatorChecker";
import { User } from "firebase/auth"; // Import User type
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/Footer";
import PricingTable from "@/components/PricingTable";
import NotificationBoard from "@/components/charts/NotificationBoard";
import { useState } from "react";
import UMAPChart from "@/components/charts/UMAP-Chart";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
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
				<section className="py-20 bg-background">
					<div className="container mx-auto px-0">
						<div className="max-w-3xl mx-auto text-center">
							<h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
								Smart Investing with Indicator Insights
							</h1>
							<p className="text-xl mb-8 text-muted-foreground">
								Empower your investment decisions with real-time stock analysis,
								advanced indicators, and market-wide visualizations.
							</p>
							<div className="flex justify-center space-x-4">
								<Button asChild>
									<Link to="/subscribe">Get Started</Link>
								</Button>
								<Button
									variant="outline"
									onClick={() => handleScroll("notification-board")}
								>
									Learn More
								</Button>
							</div>
						</div>
					</div>
				</section>
			)}

			<div className="container mx-auto px-4">
				{!user && (
					<section
						className="mt-[10em] text-center"
						onClick={() => handleScroll("notification-board")}
					>
						<h2 className="text-2xl font-normal text-neutral-600 dark:text-neutral-400">
							Get real-time insights with your favorite indicator
						</h2>
						<div className="text-4xl motion-safe:animate-bounce mt-4">
							&#8964;
						</div>
					</section>
				)}

				<section id="notification-board" className="pb-20 pt-10">
					<NotificationBoard
						user={user}
						onNotificationClick={(stock, period, indicator) => {
							handleNotificationClick(stock, period, indicator);
							handleScroll("stock-chart");
						}}
					/>
				</section>

				{!user && (
					<section className="pt-20 text-center">
						<h2 className="text-2xl md:w-2/3 mx-auto font-normal text-neutral-600 dark:text-neutral-400">
							Analyze stock performance with powerful indicators to spot
							<span className="text-green-500">
								{" "}
								profitable opportunities
							</span>{" "}
							and
							<span className="text-red-500"> potential risks</span>
						</h2>
						<div className="text-4xl motion-safe:animate-bounce mt-4">
							&#8964;
						</div>
					</section>
				)}

				<section id="stock-chart" className="pb-20 pt-10 ">
					<StockChart
						user={user}
						selectedStock={selectedStock}
						selectedPeriod={selectedPeriod}
						selectedIndicators={selectedIndicators}
					/>
				</section>

				{!user && (
					<section className="pt-20 text-center">
						<h2 className="text-2xl font-normal text-neutral-600 dark:text-neutral-400">
							Check an indicator for all stocks
						</h2>
						<div className="text-4xl motion-safe:animate-bounce mt-4">
							&#8964;
						</div>
					</section>
				)}

				<section className="pb-20 pt-10 ">
					<IndicatorChecker user={user} />
				</section>

				{!user && (
					<section
						className="pt-20 text-center"
						onClick={() => handleScroll("umap-board")}
					>
						<h2 className="text-2xl font-normal text-neutral-600 dark:text-neutral-400">
							Visualize the entire market at a glance <br />
							<span className="text-blue-500 bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded-full text-xs font-semibold inline-block align-middle mt-2">
								NEW
							</span>
						</h2>
						<div className="text-4xl motion-safe:animate-bounce mt-4">
							&#8964;
						</div>
					</section>
				)}

				<section id="umap-board" className="pb-20 pt-10 ">
					<UMAPChart user={user} />
				</section>

				{!user && (
					<section className="pt-20 text-center">
						<h2 className="text-2xl font-normal text-neutral-600 dark:text-neutral-400 mb-4">
							Get access to more indicators and features
						</h2>
						<div className="text-4xl motion-safe:animate-bounce mb-8">
							&#8964;
						</div>
						<div className="flex pb-10">
							<PricingTable />
						</div>
					</section>
				)}

				{!user && (
					<section className="py-20 bg-background">
						<div className="container mx-auto px-4">
							<h2 className="text-3xl font-bold text-center mb-10 text-foreground">
								Frequently Asked Questions
							</h2>
							<Accordion
								type="single"
								collapsible
								className="max-w-2xl mx-auto"
							>
								<AccordionItem value="item-1">
									<AccordionTrigger>
										What indicators are available?
									</AccordionTrigger>
									<AccordionContent>
										We offer a range of popular indicators including RMI, RSI,
										EMA, MACD, and Bollinger Bands. We will add new indicators
										regularly.
									</AccordionContent>
								</AccordionItem>
								<AccordionItem value="item-2">
									<AccordionTrigger>
										How often is the data updated?
									</AccordionTrigger>
									<AccordionContent>
										Our data is updated in real-time during market hours,
										ensuring you always have the latest information for your
										analysis.
									</AccordionContent>
								</AccordionItem>
								<AccordionItem value="item-3">
									<AccordionTrigger>
										Can I use this for any stock market?
									</AccordionTrigger>
									<AccordionContent>
										Currently, we support major US stock exchanges. We're
										working on expanding our coverage to include international
										markets in the future.
									</AccordionContent>
								</AccordionItem>
								<AccordionItem value="item-4">
									<AccordionTrigger>
										What's the difference between free and premium plans?
									</AccordionTrigger>
									<AccordionContent>
										Premium plans offer access to more indicators, longer
										historical data, custom alerts, and priority customer
										support. Check our pricing table for a detailed comparison.
									</AccordionContent>
								</AccordionItem>
							</Accordion>
						</div>
					</section>
				)}

				<SiteFooter />
			</div>
		</>
	);
}

export default Home;
