export default function WhatIsBollingerBands() {
	return (
		<article className="container mx-auto px-4 py-8 max-w-3xl">
			<h1 className="text-3xl font-bold mb-4">What are Bollinger Bands?</h1>
			<p className="text-gray-600 mb-4">August 24, 2024</p>
			<section className="space-y-4 text-justify">
				<p>
					Bollinger Bands are a popular technical analysis tool used to measure
					market volatility and identify potential overbought or oversold
					conditions. They consist of a set of three lines plotted on a price
					chart, providing insights into price action and potential trend
					reversals.
				</p>
				<h2 className="text-2xl font-semibold mt-6 mb-2">Introduction</h2>
				<p>
					Bollinger Bands were developed by John Bollinger in the 1980s. They
					have become a widely used indicator in various financial markets,
					helping traders and analysts assess price volatility, identify
					potential breakouts, and gauge market trends.
				</p>
				<h2 className="text-2xl font-semibold mt-6 mb-2">Calculation</h2>
				<p>Bollinger Bands are calculated using the following steps:</p>
				<ol className="list-decimal list-inside pl-4 space-y-2">
					<li>
						Calculate the simple moving average (SMA) of the price, typically
						using a 20-period SMA.
					</li>
					<li>
						Calculate the standard deviation of price over the same period.
					</li>
					<li>
						Create the upper band by adding two standard deviations to the SMA.
					</li>
					<li>
						Create the lower band by subtracting two standard deviations from
						the SMA.
					</li>
					<li>
						Plot the three lines (upper band, SMA, and lower band) on the price
						chart.
					</li>
				</ol>
				<h2 className="text-2xl font-semibold mt-6 mb-2">Interpretation</h2>
				<p>
					Bollinger Bands expand during periods of high volatility and contract
					during low volatility. Price tends to bounce between the upper and
					lower bands, with moves outside the bands potentially signaling
					overbought or oversold conditions.
				</p>
				<h2 className="text-2xl font-semibold mt-6 mb-2">Usage in Trading</h2>
				<p>
					Traders use Bollinger Bands to identify potential reversal points,
					measure market volatility, and spot potential breakouts. They can also
					be used in conjunction with other indicators to confirm trends and
					generate trading signals.
				</p>
				<h2 className="text-2xl font-semibold mt-6 mb-2">Limitations</h2>
				<p>
					While Bollinger Bands are useful, they should not be used in
					isolation. They can sometimes provide false signals, especially in
					strongly trending markets. It's important to use them alongside other
					technical and fundamental analysis tools for more reliable trading
					decisions.
				</p>
			</section>
		</article>
	);
}
