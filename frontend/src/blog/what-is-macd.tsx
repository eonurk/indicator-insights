export default function WhatIsMACD() {
	return (
		<article className="container mx-auto px-4 py-8 max-w-3xl">
			<h1 className="text-3xl font-bold mb-4">What is MACD?</h1>
			<p className="text-gray-600 mb-4">August 23, 2024</p>
			<section className="space-y-4 text-justify">
				<p>
					Moving Average Convergence Divergence (MACD) is a popular technical
					indicator used in financial markets to analyze price trends and
					momentum. It combines two moving averages to identify potential buy
					and sell signals, as well as trend direction and strength.
				</p>
				<h2 className="text-2xl font-semibold mt-6 mb-2">Introduction</h2>
				<p>
					The MACD indicator was developed by Gerald Appel in the late 1970s. It
					is widely used by traders and analysts to identify trend changes,
					measure momentum, and generate trading signals in various financial
					markets.
				</p>
				<h2 className="text-2xl font-semibold mt-6 mb-2">Calculation</h2>
				<p>The MACD is calculated using the following steps:</p>
				<ol className="list-decimal list-inside pl-4 space-y-2">
					<li>Calculate the 12-period Exponential Moving Average (EMA).</li>
					<li>Calculate the 26-period Exponential Moving Average (EMA).</li>
					<li>
						Subtract the 26-period EMA from the 12-period EMA to get the MACD
						line.
					</li>
					<li>Calculate a 9-period EMA of the MACD line (the signal line).</li>
					<li>
						Plot the MACD line and signal line on a chart, often with a
						histogram showing their difference.
					</li>
				</ol>
				<h2 className="text-2xl font-semibold mt-6 mb-2">Interpretation</h2>
				<p>
					The MACD generates signals through crossovers, divergences, and rapid
					rises or falls. When the MACD line crosses above the signal line, it's
					considered a bullish signal, while a crossover below the signal line
					is bearish.
				</p>
				<h2 className="text-2xl font-semibold mt-6 mb-2">Usage in Trading</h2>
				<p>
					Traders use MACD to identify potential entry and exit points, confirm
					trends, and spot divergences between price action and momentum. It can
					be applied to various timeframes and financial instruments.
				</p>
				<h2 className="text-2xl font-semibold mt-6 mb-2">Limitations</h2>
				<p>
					Like all indicators, MACD has limitations. It can produce false
					signals in choppy or ranging markets and may lag behind price action.
					It's best used in conjunction with other technical analysis tools and
					fundamental analysis for more reliable trading decisions.
				</p>
			</section>
		</article>
	);
}
