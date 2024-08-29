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
			<div className="container mx-auto px-4 py-8 space-y-12 md:space-y-16">
				<section className="space-y-6 max-w-3xl mx-auto">
					<h1 className="text-3xl md:text-4xl font-bold text-primary">
						About Indicator Insights
					</h1>
					<div className="space-y-4 text-base text-neutral-600 dark:text-neutral-400">
						<p className="text-justify">
							Indicator Insights was born from a shared experience many
							investors face: the rollercoaster of early market ventures. Our
							founder, like countless others, initially encountered significant
							losses when stepping into the world of stock trading. It was a
							humbling experience that sparked a relentless curiosity and drive
							to understand the market's underlying mechanics.
						</p>
						<p className="text-justify">
							This journey led to countless hours spent in finance forums,
							poring over market analyses, and diving deep into the world of
							technical indicators. It was here that a revelation occurred:
							these indicators, often overlooked by casual traders, held the
							potential to transform gut feelings into data-driven decisions.
						</p>
						<p className="text-justify">
							As the power of these tools became apparent, so did a stark
							realization: many trading strategies relied heavily on following
							others' opinions or chasing market trends, often leading to
							disappointing results. This insight fueled a burning question that
							would become the cornerstone of our mission:
						</p>
						<blockquote className="my-4 pl-4 border-l-4 border-primary italic">
							"How can we harness the power of indicators to consistently
							generate profit over time, regardless of market conditions?"
						</blockquote>
						<p className="text-justify">
							This question wasn't just about personal gain; it represented a
							desire to empower every investor with the tools and knowledge to
							make informed decisions. We recognized a significant gap in the
							market: while individual indicators were widely available, there
							was a lack of comprehensive tools that could perform bulk analysis
							across multiple stocks and timeframes.
						</p>
						<p className="text-justify">
							Driven by an analytical mindset and a passion for problem-solving,
							our team embarked on a challenging journey. Despite having limited
							experience in web development, we were determined to turn this
							vision into reality. Countless late nights, debugging sessions,
							and iterations later, Indicator Insights began to take shape.
						</p>
						<p className="text-justify">
							What started as a personal project to navigate the complexities of
							the stock market has evolved into a powerful platform designed to
							democratize advanced financial analysis. Our goal is to level the
							playing field, giving individual investors access to the same
							caliber of tools and insights traditionally reserved for large
							financial institutions.
						</p>
						<p className="text-justify">
							Today, Indicator Insights stands as a testament to the power of
							curiosity, perseverance, and the belief that data-driven decisions
							can transform the way we approach investing. We're more than just
							a tool; we're a community of like-minded individuals who believe
							in the power of informed decision-making in the financial markets.
						</p>
					</div>
				</section>

				<section className="space-y-6 max-w-3xl mx-auto">
					<h2 className="text-2xl md:text-3xl font-bold text-primary">
						Our Mission
					</h2>
					<p className="text-base text-neutral-600 dark:text-neutral-400 text-justify">
						Our mission is to revolutionize financial decision-making by
						providing cutting-edge analytics and real-time insights. We empower
						our clients to navigate complex markets with confidence and
						precision, leveraging the best in financial technology and data
						science.
					</p>
				</section>

				<section className="space-y-6">
					<h2 className="text-2xl md:text-3xl font-bold text-primary max-w-3xl mx-auto">
						Key Features
					</h2>
					<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
						<FeatureCard
							icon={<BarChart3Icon className="h-6 w-6 text-primary" />}
							title="Advanced Analytics"
							description="Discover hidden patterns and trends in financial data with our advanced algorithms."
						/>
						<FeatureCard
							icon={<TrendingUpIcon className="h-6 w-6 text-primary" />}
							title="Real-time Insights"
							description="Stay ahead with real-time data processing and instant notifications on market shifts."
						/>
						<FeatureCard
							icon={<ZapIcon className="h-6 w-6 text-primary" />}
							title="Customizable Dashboards"
							description="Tailor your analytics experience with our flexible and intuitive dashboard tools."
						/>
					</div>
				</section>

				<section className="space-y-6 max-w-3xl mx-auto">
					<h2 className="text-2xl md:text-3xl font-bold text-primary">
						Our Journey
					</h2>
					<div className="relative border-l border-gray-200 dark:border-gray-700 pl-4">
						<TimelineItem
							date="May 2024"
							title="Inception"
							description="The idea of Indicator Insights is conceived during a market analysis session."
						/>
						<TimelineItem
							date="June 2024"
							title="Development Begins"
							description="Work starts on the core analytics engine and user interface."
						/>
						<TimelineItem
							date="July 2024"
							title="Beta Testing"
							description="Early access version released to a small group of testers."
						/>
						<TimelineItem
							date="August 2024"
							title="Official Launch"
							description="Indicator Insights goes live, offering powerful insights to investors."
						/>
					</div>
				</section>

				<section className="space-y-6 max-w-3xl mx-auto">
					<h2 className="text-2xl md:text-3xl font-bold text-primary">
						Ready to Gain Market Insights?
					</h2>
					<p className="text-base md:text-lg text-muted-foreground">
						Join our growing community of data-driven investors using Indicator
						Insights to navigate the markets.
					</p>

					<Link to="/subscribe">
						<Button
							size="lg"
							className="bg-primary w-full sm:w-auto mt-4 bg-blue-600"
						>
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

function TimelineItem({ date, title, description }) {
	return (
		<div className="mb-10 ml-6">
			<span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
				<svg
					className="w-2.5 h-2.5 text-blue-800 dark:text-blue-300"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					fill="currentColor"
					viewBox="0 0 20 20"
				>
					<path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
				</svg>
			</span>
			<h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
				{title}
			</h3>
			<time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
				{date}
			</time>
			<p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
				{description}
			</p>
		</div>
	);
}
