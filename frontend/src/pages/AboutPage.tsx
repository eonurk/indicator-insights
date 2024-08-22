import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3Icon, TrendingUpIcon, ZapIcon } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Link } from "react-router-dom";
import { SiteFooter } from "@/components/Footer";

export default function AboutPage() {
	return (
		<>
			<SiteHeader />
			<div className="container mx-auto px-4 py-8 space-y-10 md:space-y-12">
				<section className="text-center space-y-4">
					<h1 className="text-2xl md:text-2xl font-bold dark:text-neutral-400 ">
						About Indicator Insights
					</h1>

					<p className=" text-base text-neutral-600 dark:text-neutral-400 text-justify text-muted-foreground max-w-2xl mx-auto">
						We are a small business started in an apartment by our founder. Like
						any other amateur hobbyist in the stock market, Onur, lost a
						considerable amount of money before deciding looking into finance
						forums. There, he learned about indicators, which are used for
						decision-making before buying or selling a stock.
					</p>

					<p className="text-base text-neutral-600 dark:text-neutral-400 text-justify text-muted-foreground max-w-2xl mx-auto">
						He decided to give these indicators a shot. He immediately noticed
						that he could actually do better than random stock exchange, which
						is usually based on other's opinion, using this new fancy
						indicators. His main objective was simple yet noble:
					</p>

					<p className=" text-base text-neutral-600 dark:text-neutral-400 text-justify text-muted-foreground max-w-2xl mx-auto">
						<blockquote className="my-4 italic">
							"How much money can I make with this sh*t for a given period?"
						</blockquote>
						This turned out to be non-existent for most analytic tools, at least
						for bulk-analysis. Given his analytical nature and his non-existent
						background in writing web applications along with his naive
						optimism, he embarked on a quest to make this hobby a torture, and
						decided to create Indicator Insights.
					</p>
				</section>

				<section className="space-y-4">
					<h1 className="text-2xl md:text-2xl font-bold dark:text-neutral-400 ">
						Our Mission
					</h1>

					<p className="text-base text-neutral-600 dark:text-neutral-400 text-justify text-muted-foreground max-w-2xl mx-auto">
						To revolutionize financial decision-making by providing cutting-edge
						analytics and real-time insights, enabling our clients to navigate
						complex markets with confidence and precision. Bla bla bla.
					</p>
				</section>

				<section className="space-y-6">
					<h2 className="text-2xl md:text-2xl font-bold dark:text-neutral-400 ">
						Key Features
					</h2>
					<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
						<FeatureCard
							icon={
								<BarChart3Icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
							}
							title="Advanced Analytics"
							description="(AI and sh*t) Uncover hidden patterns and trends in financial data with our sophisticated algorithms."
						/>
						<FeatureCard
							icon={
								<TrendingUpIcon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
							}
							title="Real-time Insights"
							description="(Non-existent but when implemented money will be asked) Stay ahead with real-time data processing and instant notifications on market shifts."
						/>
						<FeatureCard
							icon={<ZapIcon className="h-5 w-5 md:h-6 md:w-6 text-primary" />}
							title="Customizable Dashboards"
							description="(No dashboard, just bam) Tailor your analytics experience with flexible and intuitive dashboard tools."
						/>
					</div>
				</section>

				<section className="space-y-6">
					<h2 className="text-2xl md:text-2xl font-bold dark:text-neutral-400">
						Our Journey
					</h2>
					<div className="space-y-6 md:space-y-8">
						<TimelineItem year="2018" event="-" />
						<TimelineItem year="2019" event="Onur lost money in crypto. How?" />
						<TimelineItem
							year="2021"
							event="Lost more money on the stock market..."
						/>
						<TimelineItem
							year="2024"
							event="F*ck this. Indicator Insights officially launched."
						/>
					</div>
				</section>

				<section className="text-center space-y-6">
					<h2 className="text-2xl md:text-2xl font-bold dark:text-neutral-400 ">
						Ready to Gain Market Insights?
					</h2>
					<p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
						Join 2-3 people making data-driven decisions with Indicator
						Insights.
					</p>
					<Button size="lg" className="w-full sm:w-auto">
						<Link to="/signup">Get Started Now</Link>
					</Button>
				</section>
			</div>
			<SiteFooter />
		</>
	);
}

function FeatureCard({ icon, title, description }) {
	return (
		<Card>
			<CardHeader className="items-center ">
				<CardTitle className="flex items-center  gap-2 text-lg md:text-xl">
					{icon}
					<span>{title}</span>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<p className="text-sm md:text-base text-muted-foreground">
					{description}
				</p>
			</CardContent>
		</Card>
	);
}

function TimelineItem({ year, event }) {
	return (
		<>
			<div className=" text-neutral-600 dark:text-neutral-400 text-center text-muted-foreground max-w-2xl mx-auto">
				<p className="text-xl font-bold">{year}</p>

				<p className="text-base">{event}</p>
			</div>
		</>
	);
}
