import { SiteFooter } from "@/components/Footer";
import { SiteHeader } from "@/components/site-header";
import BlogEntry from "@/components/JobEntry"; // Import the BlogEntry component

interface Blog {
	title: string;
	date: string;
	link: string;
	description: string;
}

const blogEntries: Blog[] = [
	{
		title: "Introducing AI Summary: Revolutionizing Stock Analysis",
		date: "September 5, 2024",
		link: "introducing-ai-summary",
		description:
			"We're excited to announce the launch of our new AI Summary feature, designed to transform the way you analyze stocks and make informed trading decisions. This powerful tool combines advanced technical indicators with artificial intelligence to provide you with concise, actionable insights.",
	},
	{
		title: "What is RMI?",
		date: "September 1, 2024",
		link: "what-is-rmi",
		description:
			"Relative Momentum Index (RMI) is a technical indicator that measures the speed and change of price movements. It helps traders identify overbought or oversold conditions in the market. The RMI is calculated using the closing prices of a stock and is displayed on a scale from 0 to 100. Typically, the default time period for the RMI is 14 days, but it can be customized to fit various trading strategies.",
	},
	{
		title: "What is RSI?",
		date: "August 22, 2024",
		link: "what-is-rsi",
		description:
			"Relative Strength Index (RSI) is a momentum oscillator that measures the speed and change of price movements. It is used to identify overbought or oversold conditions in the market. RSI is calculated using the closing prices of a stock and is plotted on a scale of 0 to 100. The default time period for RSI is 14 days, but it can be adjusted to suit different trading strategies.",
	},
	{
		title: "What is Bollinger Bands?",
		date: "August 22, 2024",
		link: "what-is-bollinger-bands",
		description:
			"Bollinger Bands are a technical analysis tool used to identify potential overbought or oversold conditions in the market. They consist of three lines: the upper band, the middle band, and the lower band. The middle band is typically a simple moving average (SMA) of the closing prices, while the upper and lower bands are calculated using the standard deviation of the closing prices. The width of the bands can change as the volatility of the stock increases or decreases.",
	},
	{
		title: "What is MACD?",
		date: "August 22, 2024",
		link: "what-is-macd",
		description:
			"Moving Average Convergence Divergence (MACD) is a trend-following momentum indicator that shows the relationship between two moving averages of a security's price. It is calculated by subtracting the 26-day exponential moving average (EMA) from the 12-day EMA. The MACD line is then plotted on a chart, along with a signal line that is a 9-day EMA of the MACD line. The MACD histogram is the difference between the MACD line and the signal line. MACD is used to identify the direction and strength of a trend, as well as potential overbought or oversold conditions.",
	},
	{
		title: "What is SMA?",
		date: "August 22, 2024",
		link: "what-is-sma",
		description:
			"Simple Moving Average (SMA) is a technical analysis tool used to identify the average price of a security over a specified period of time. It is calculated by adding the closing prices of a stock over a specified period and dividing by the number of days in that period. SMA is used to identify the trend direction of a stock and can help traders determine when to enter or exit a trade.",
	},
	{
		title: "What is a Financial Indicator?",
		date: "August 22, 2024",
		link: "what-is-financial-indicator",
		description:
			"A financial indicator is a statistical measure used to analyze and interpret financial market trends, economic conditions, or company performance. These indicators help investors, analysts, and policymakers make informed decisions by providing insights into various aspects of financial and economic activity.",
	},
];

export function BlogPage() {
	return (
		<>
			<SiteHeader />

			<div className="flex flex-col justify-center items-center px-4 max-w-xl md:m-auto mt-10 mb-20">
				{blogEntries.map((entry, index) => (
					<BlogEntry
						key={index}
						title={entry.title}
						date={entry.date}
						link={entry.link}
						description={entry.description}
					/>
				))}
			</div>
			<SiteFooter />
		</>
	);
}

export default BlogPage;
