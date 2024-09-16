export default function WhatIsRSI() {
	return (
		<article className="container mx-auto px-4 py-8 max-w-3xl">
			<h1 className="text-3xl font-bold mb-4">What is RSI?</h1>
			<p className="text-gray-600 mb-4">August 23, 2024</p>
			<section className="space-y-4 text-justify">
				<p>
					Relative Strength Index (RSI) is a popular momentum oscillator used in
					technical analysis to measure the speed and change of price movements.
					It is primarily used to identify overbought or oversold conditions in
					a market.
				</p>
				<h2 className="text-2xl font-semibold mt-6 mb-2">Introduction</h2>
				<p>
					The Relative Strength Index (RSI) was developed by J. Welles Wilder
					Jr. and introduced in his 1978 book, "New Concepts in Technical
					Trading Systems". It has since become one of the most widely used
					technical indicators among traders and analysts.
				</p>
				<h2 className="text-2xl font-semibold mt-6 mb-2">Calculation</h2>
				<p>The RSI is calculated using the following steps:</p>
				<ol className="list-decimal list-inside pl-4 space-y-2">
					<li>Choose a time period (typically 14 days).</li>
					<li>
						Calculate the average gain and average loss over the chosen period.
					</li>
					<li>
						Calculate the Relative Strength (RS) by dividing the average gain by
						the average loss.
					</li>
					<li>
						Calculate the RSI using the formula: RSI = 100 - (100 / (1 + RS)).
					</li>
				</ol>
				<h2 className="text-2xl font-semibold mt-6 mb-2">Interpretation</h2>
				<p>
					The RSI oscillates between 0 and 100. Traditionally, RSI values above
					70 are considered overbought, while values below 30 are considered
					oversold. However, these levels can be adjusted based on market
					conditions and individual preferences.
				</p>
				<h2 className="text-2xl font-semibold mt-6 mb-2">Usage in Trading</h2>
				<p>
					Traders use the RSI to identify potential reversal points, confirm
					trends, and spot divergences between the indicator and price. It can
					be used to generate buy and sell signals, with traders often looking
					to sell when the RSI moves above 70 and buy when it drops below 30.
				</p>
				<h2 className="text-2xl font-semibold mt-6 mb-2">Limitations</h2>
				<p>
					While the RSI is a powerful tool, it has limitations. It can give
					false signals in strongly trending markets and may not always
					accurately predict market tops or bottoms. As with any technical
					indicator, it's best used in conjunction with other forms of analysis
					for more reliable trading decisions.
				</p>
			</section>
		</article>
	);
}
