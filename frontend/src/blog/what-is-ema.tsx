export default function WhatIsEMA() {
	return (
		<article className="container mx-auto px-4 py-8 max-w-3xl">
			<h1 className="text-3xl font-bold mb-4">What is EMA?</h1>
			<p className="text-gray-600 mb-4">August 22, 2024</p>
			<section className="space-y-4 text-justify">
				<p>
					Exponential Moving Average (EMA) is a technical indicator that
					measures the average price of an asset over a specified period, giving
					more weight to recent price data. It is widely used in financial
					markets to identify trends and potential reversal points.
				</p>
				<h2 className="text-2xl font-semibold mt-6 mb-2">Introduction</h2>
				<p>
					The Exponential Moving Average (EMA) is an improvement over the Simple
					Moving Average (SMA). It responds more quickly to recent price changes
					by applying a greater weight to more recent data points. This makes
					the EMA more sensitive to new information and potentially more useful
					for short-term trading.
				</p>
				<h2 className="text-2xl font-semibold mt-6 mb-2">Calculation</h2>
				<p>The EMA is calculated using the following steps:</p>
				<ol className="list-decimal list-inside pl-4 space-y-2">
					<li>Choose a time period (e.g., 12 days, 26 days).</li>
					<li>
						Calculate the Simple Moving Average (SMA) for the initial EMA value.
					</li>
					<li>Calculate the multiplier: (2 / (time period + 1)).</li>
					<li>
						For each subsequent period, apply the formula: EMA = (Close -
						Previous EMA) * multiplier + Previous EMA.
					</li>
				</ol>
				<h2 className="text-2xl font-semibold mt-6 mb-2">Interpretation</h2>
				<p>
					The EMA line can be used to identify trends. When the price is above
					the EMA, it generally indicates an uptrend. Conversely, when the price
					is below the EMA, it may indicate a downtrend.
				</p>
				<h2 className="text-2xl font-semibold mt-6 mb-2">Usage in Trading</h2>
				<p>
					Traders often use EMAs to generate buy and sell signals. Common
					strategies include trading based on EMA crossovers or using EMAs as
					dynamic support and resistance levels.
				</p>
				<h2 className="text-2xl font-semibold mt-6 mb-2">Limitations</h2>
				<p>
					While EMAs are useful, they are lagging indicators and may not always
					predict future price movements accurately. They work best in trending
					markets and may give false signals in choppy or sideways markets. It's
					important to use EMAs in conjunction with other technical indicators
					and analysis methods.
				</p>
			</section>
		</article>
	);
}
