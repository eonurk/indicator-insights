export default function WhatIsSMA() {
	return (
		<article className="container mx-auto px-4 py-8 max-w-3xl">
			<h1 className="text-3xl font-bold mb-4">What is SMA?</h1>
			<p className="text-gray-600 mb-4">August 25, 2024</p>
			<section className="space-y-4 text-justify">
				<p>
					Simple Moving Average (SMA) is a fundamental technical analysis tool
					used to smooth out price data and identify trends in financial
					markets. It calculates the average price over a specified period,
					helping traders and analysts to filter out short-term price
					fluctuations and focus on overall market direction.
				</p>
				<h2 className="text-2xl font-semibold mt-6 mb-2">Introduction</h2>
				<p>
					The Simple Moving Average is one of the oldest and most widely used
					technical indicators. Its simplicity and effectiveness make it a
					popular choice for both novice and experienced traders across various
					financial instruments and timeframes.
				</p>
				<h2 className="text-2xl font-semibold mt-6 mb-2">Calculation</h2>
				<p>The SMA is calculated using the following steps:</p>
				<ol className="list-decimal list-inside pl-4 space-y-2">
					<li>Choose a time period (e.g., 20 days, 50 days, 200 days).</li>
					<li>Sum up the closing prices for the chosen number of periods.</li>
					<li>Divide the sum by the number of periods.</li>
					<li>
						Repeat this calculation for each new data point, creating a moving
						average line.
					</li>
				</ol>
				<h2 className="text-2xl font-semibold mt-6 mb-2">Interpretation</h2>
				<p>
					The SMA helps identify trends and potential support or resistance
					levels. When the price is above the SMA, it generally indicates an
					uptrend, while a price below the SMA suggests a downtrend. Crossovers
					between price and SMA, or between different SMAs, can signal potential
					trend changes.
				</p>
				<h2 className="text-2xl font-semibold mt-6 mb-2">Usage in Trading</h2>
				<p>
					Traders use SMAs to identify trend direction, generate buy or sell
					signals, and determine potential entry or exit points. Common
					applications include using crossovers between short-term and long-term
					SMAs, or using SMAs as dynamic support and resistance levels.
				</p>
				<h2 className="text-2xl font-semibold mt-6 mb-2">Limitations</h2>
				<p>
					While the SMA is useful, it has limitations. It lags behind price
					action, which can lead to delayed signals in fast-moving markets. It
					also gives equal weight to all data points, which may not always
					reflect recent market dynamics accurately. As with all indicators,
					it's best used in conjunction with other technical and fundamental
					analysis tools.
				</p>
			</section>
		</article>
	);
}
