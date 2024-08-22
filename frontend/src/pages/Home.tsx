import StockChart from "@/components/charts/StockChart";
import IndicatorChecker from "@/components/charts/IndicatorChecker";
import { User } from "firebase/auth"; // Import User type
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SiteFooter } from "@/components/Footer";

interface StockChartProps {
	user: User | null; // Use User type from firebase/auth
}

export function Home({ user }: StockChartProps) {
	return (
		<>
			<SiteHeader />

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
			<StockChart user={user} />

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
						<Button className="text-base p-6 w-64">
							<Link to="/signup">Sign Up</Link>
						</Button>
					</div>
				</div>
			)}
			<SiteFooter />
		</>
	);
}

export default Home;
