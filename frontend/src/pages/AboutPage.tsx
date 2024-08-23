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
					<h1 className="text-2xl md:text-2xl font-bold dark:text-neutral-400">
						About Indicator Insights
					</h1>
					<p className="text-base text-neutral-600 dark:text-neutral-400 text-justify max-w-2xl mx-auto">
						Indicator Insights began as a passion project, founded by Onur in
						his apartment. Like many who venture into the stock market, Onur
						initially faced significant losses. However, his curiosity led him
						to finance forums, where he discovered the power of indicators—tools
						designed to assist in making informed decisions about buying and
						selling stocks.
					</p>
					<p className="text-base text-neutral-600 dark:text-neutral-400 text-justify max-w-2xl mx-auto">
						Motivated by the potential of these indicators, Onur quickly
						realized their ability to outperform random stock market strategies,
						which often rely heavily on the opinions of others. With a clear
						goal in mind, he embarked on a journey to answer a simple yet
						profound question:
					</p>
					<p className="text-base text-neutral-600 dark:text-neutral-400 text-justify max-w-2xl mx-auto">
						<blockquote className="my-4 italic">
							"How much profit can I generate over a given period using these
							indicators?"
						</blockquote>
						Recognizing a gap in existing analytical tools—especially those
						capable of bulk analysis—Onur, driven by his analytical mindset and
						despite having no prior experience in web development, decided to
						turn this hobby into a mission, leading to the creation of Indicator
						Insights.
					</p>
				</section>

				<section className="space-y-4">
					<h1 className="text-2xl md:text-2xl font-bold dark:text-neutral-400">
						Our Mission
					</h1>
					<p className="text-base text-neutral-600 dark:text-neutral-400 text-justify max-w-2xl mx-auto">
						Our mission is to revolutionize financial decision-making by
						providing cutting-edge analytics and real-time insights. We empower
						our clients to navigate complex markets with confidence and
						precision, leveraging the best in financial technology and data
						science.
					</p>
				</section>

				<section className="space-y-6">
					<h2 className="text-2xl md:text-2xl font-bold dark:text-neutral-400">
						Key Features
					</h2>
					<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
						<FeatureCard
							icon={
								<BarChart3Icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
							}
							title="Advanced Analytics"
							description="Discover hidden patterns and trends in financial data with our advanced algorithms."
						/>
						<FeatureCard
							icon={
								<TrendingUpIcon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
							}
							title="Real-time Insights"
							description="Stay ahead with real-time data processing and instant notifications on market shifts."
						/>
						<FeatureCard
							icon={<ZapIcon className="h-5 w-5 md:h-6 md:w-6 text-primary" />}
							title="Customizable Dashboards"
							description="Tailor your analytics experience with our flexible and intuitive dashboard tools."
						/>
					</div>
				</section>

				<section className="space-y-6">
					<h2 className="text-2xl md:text-2xl font-bold dark:text-neutral-400">
						Our Journey
					</h2>
					<div className="space-y-6 md:space-y-8">
						<TimelineItem
							year="2023"
							event="The idea of Indicator Insights is conceived."
						/>

						<TimelineItem
							year="2024"
							event="Indicator Insights officially launches, transforming a personal challenge into a powerful financial tool."
						/>
					</div>
				</section>

				<section className="text-center space-y-6">
					<h2 className="text-2xl md:text-2xl font-bold dark:text-neutral-400">
						Ready to Gain Market Insights?
					</h2>
					<p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
						Join our growing community of data-driven investors using Indicator
						Insights to navigate the markets.
					</p>

					<Link to="/signup">
						<Button size="lg" className="bg-blue-500 w-full sm:w-auto">
							Get Started Now
						</Button>
					</Link>
				</section>
			</div>
			<SiteFooter />
		</>
	);
}

function FeatureCard({ icon, title, description }) {
	return (
		<Card>
			<CardHeader className="items-center">
				<CardTitle className="flex items-center gap-2 text-lg md:text-xl">
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
		<div className="text-neutral-600 dark:text-neutral-400 text-center max-w-2xl mx-auto">
			<p className="text-xl font-bold">{year}</p>
			<p className="text-base">{event}</p>
		</div>
	);
}
