// rsiCalculator.tsx
/**
 * Calculate the RSI (Relative Strength Index) for a given dataset.
 * @param closingPrices - Array of closing prices.
 * @param period - The period over which to calculate RSI (typically 14).
 * @returns RSI values for each period.
 */
export function RSI(closingPrices: number[], period: number = 14): number[] {
	if (closingPrices.length < period) {
		throw new Error("Insufficient data to calculate RSI");
	}

	const gains: number[] = [];
	const losses: number[] = [];

	// Calculate gains and losses
	for (let i = 1; i < closingPrices.length; i++) {
		const change = closingPrices[i] - closingPrices[i - 1];
		if (change > 0) {
			gains.push(change);
			losses.push(0);
		} else {
			gains.push(0);
			losses.push(-change);
		}
	}

	// Calculate average gains and losses
	const avgGains: number[] = [];
	const avgLosses: number[] = [];

	for (let i = 0; i < gains.length; i++) {
		if (i >= period - 1) {
			const periodGains = gains.slice(i + 1 - period, i + 1);
			const periodLosses = losses.slice(i + 1 - period, i + 1);

			const averageGain = periodGains.reduce((a, b) => a + b, 0) / period;
			const averageLoss = periodLosses.reduce((a, b) => a + b, 0) / period;

			avgGains.push(averageGain);
			avgLosses.push(averageLoss);
		}
	}

	// Calculate RSI
	const rsi: number[] = [];

	for (let i = 0; i < avgGains.length; i++) {
		const rs = avgGains[i] / avgLosses[i];
		const rsiValue = 100 - 100 / (1 + rs);
		rsi.push(rsiValue);
	}

	// Pad the beginning of the RSI array with nulls to match the length of closingPrices
	return [...Array(period - 1).fill(null), ...rsi];
}

// rmiCalculator.tsx

/**
 * Calculate the RMI (Relative Momentum Index) for a given dataset.
 * @param closingPrices - Array of closing prices.
 * @param period - The period over which to calculate RMI (typically 14).
 * @returns RMI values for each period.
 */
export function RMI(closingPrices: number[], period: number = 14): number[] {
	if (closingPrices.length < period) {
		throw new Error("Insufficient data to calculate RMI");
	}

	const momentum: number[] = [];

	// Calculate momentum
	for (let i = period; i < closingPrices.length; i++) {
		momentum.push(closingPrices[i] - closingPrices[i - period]);
	}

	// Calculate average momentum
	const avgMomentum: number[] = [];
	for (let i = 0; i < momentum.length; i++) {
		const periodMomentum = momentum.slice(i, i + period);
		const averageMomentum = periodMomentum.reduce((a, b) => a + b, 0) / period;
		avgMomentum.push(averageMomentum);
	}

	// Normalize the RMI
	const rmi: number[] = avgMomentum.map((val) => 100 / (1 + Math.exp(-val)));

	// Pad the beginning of the RMI array with nulls to match the length of closingPrices
	return [...Array(period - 1).fill(null), ...rmi];
}
