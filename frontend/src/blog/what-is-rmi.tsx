export default function WhatIsRMI() {
	return (
		<article className="container mx-auto px-4 py-8 max-w-3xl">
			<h1 className="text-3xl font-bold mb-4">What is RMI?</h1>
			<p className="text-gray-600 mb-4">August 22, 2024</p>
			<section className="space-y-4 text-justify">
				<p>
					Relative Momentum Index (RMI) is a technical indicator that measures
					the speed and change of price movements. It is an extension of the
					Relative Strength Index (RSI) and is used to identify overbought or
					oversold conditions in a market.
				</p>
				<h2 className="text-2xl font-semibold mt-6 mb-2">Introduction</h2>
				<p>
					The Relative Momentum Index (RMI) was developed by Roger Altman in
					1993. It is designed to address some of the limitations of the RSI by
					incorporating momentum into the calculation. The RMI can be used to
					identify potential reversal points and to confirm trends.
				</p>
				<h2 className="text-2xl font-semibold mt-6 mb-2">Calculation</h2>
				<p>The RMI is calculated using the following steps:</p>
				<ol className="list-decimal list-inside pl-4 space-y-2">
					<li>Choose a look-back period (e.g., 14 days).</li>
					<li>
						Calculate the difference between the current price and the price 'n'
						days ago.
					</li>
					<li>
						Calculate the average of the positive differences (gains) and the
						average of the negative differences (losses) over the look-back
						period.
					</li>
					<li>
						Calculate the Relative Momentum (RM) by dividing the average gain by
						the average loss.
					</li>
					<li>
						Calculate the RMI using the formula: RMI = 100 - (100 / (1 + RM)).
					</li>
				</ol>
				<h2 className="text-2xl font-semibold mt-6 mb-2">Interpretation</h2>
				<p>
					The RMI is plotted on a scale of 0 to 100. Values above 70 indicate an
					overbought condition, while values below 30 indicate an oversold
					condition.
				</p>
				<h2 className="text-2xl font-semibold mt-6 mb-2">Usage in Trading</h2>
				<p>
					The RMI can be used to identify potential reversal points and to
					confirm trends. Traders may use the RMI to enter or exit trades based
					on the overbought or oversold conditions.
				</p>
				<h2 className="text-2xl font-semibold mt-6 mb-2">Limitations</h2>
				<p>
					Like other momentum oscillators, the RMI can be sensitive to market
					noise and may produce false signals. It is important to use other
					indicators and analysis tools in conjunction with the RMI to confirm
					trading signals.
				</p>
			</section>
		</article>
	);
}
