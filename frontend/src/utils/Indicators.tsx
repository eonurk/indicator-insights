// rsiCalculator.tsx
/**
 * Calculate the RSI (Relative Strength Index) for a given dataset.
 * @param closingPrices - Array of closing prices.
 * @param RSIperiod - The period over which to calculate RSI (typically 14).
 * @returns RSI values for each period.
 */
export function RSI(closingPrices: number[], RSIperiod: number = 14): number[] {
	if (closingPrices.length < RSIperiod) {
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
		if (i >= RSIperiod - 1) {
			const periodGains = gains.slice(i + 1 - RSIperiod, i + 1);
			const periodLosses = losses.slice(i + 1 - RSIperiod, i + 1);

			const averageGain = periodGains.reduce((a, b) => a + b, 0) / RSIperiod;
			const averageLoss = periodLosses.reduce((a, b) => a + b, 0) / RSIperiod;

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
	return [...Array(RSIperiod - 1).fill(null), ...rsi];
}

// rmiCalculator.tsx

/**
 * Calculate the RMI (Relative Momentum Index) for a given dataset.
 * @param closingPrices - Array of closing prices.
 * @param RMIperiod - The period over which to calculate RMI (typically 14).
 * @returns RMI values for each period.
 */
export function RMI(closingPrices: number[], RMIperiod: number = 14): number[] {
	if (closingPrices.length < RMIperiod) {
		throw new Error("Insufficient data to calculate RMI");
	}

	const momentum: number[] = [];

	// Calculate momentum
	for (let i = RMIperiod; i < closingPrices.length; i++) {
		momentum.push(closingPrices[i] - closingPrices[i - RMIperiod]);
	}

	// Calculate average momentum
	const avgMomentum: number[] = [];
	for (let i = 0; i < momentum.length; i++) {
		const periodMomentum = momentum.slice(i, i + RMIperiod);
		const averageMomentum =
			periodMomentum.reduce((a, b) => a + b, 0) / RMIperiod;
		avgMomentum.push(averageMomentum);
	}

	// Normalize the RMI
	const rmi: number[] = avgMomentum.map((val) => 100 / (1 + Math.exp(-val)));

	// Pad the beginning of the RMI array with nulls to match the length of closingPrices
	return [...Array(RMIperiod - 1).fill(null), ...rmi];
}

export function EMA(prices: number[], period = 14) {
	const multiplier = 2 / (period + 1);
	return prices.map((price, index) => {
		if (index === 0) return price; // First value is just the price
		const previousEMA = prices[index - 1];
		return (price - previousEMA) * multiplier + previousEMA;
	});
}

export function MACD(
	prices: number[],
	fastPeriod = 12,
	slowPeriod = 26,
	signalPeriod = 9
) {
	const emaFast = EMA(prices, fastPeriod);
	const emaSlow = EMA(prices, slowPeriod);

	const macdLine = emaFast.map((fast, index) => fast - emaSlow[index]);
	const signalLine = EMA(macdLine.slice(slowPeriod - fastPeriod), signalPeriod);
	const histogram = macdLine
		.slice(slowPeriod - fastPeriod)
		.map((macd, index) => macd - signalLine[index]);

	return { macdLine, signalLine, histogram };
}

/**
 * Calculate the Simple Moving Average (SMA)
 * @param prices - Array of numbers representing the prices
 * @param period - Number of periods to calculate the SMA (e.g., 50, 100, 150)
 * @returns Array of SMA values
 */
export function SMA(prices: number[], period: number): number[] {
	const sma: number[] = [];

	for (let i = 0; i < prices.length; i++) {
		if (i < period - 1) {
			// Not enough data points to calculate SMA
			sma.push(null);
		} else {
			const sum = prices
				.slice(i - period + 1, i + 1)
				.reduce((acc, price) => acc + price, 0);
			sma.push(sum / period);
		}
	}

	return sma;
}

export function BollingerBands(prices: number[], period = 20, stdDev = 2) {
	const sma = SMA(prices, period);
	const bands = prices.map((_, i) => {
		if (i < period - 1) return { upper: null, lower: null, middle: null };

		const slice = prices.slice(i - period + 1, i + 1);
		const avg = sma[i];
		const variance =
			slice.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / period;
		const stdDeviation = Math.sqrt(variance);

		return {
			upper: avg + stdDev * stdDeviation,
			lower: avg - stdDev * stdDeviation,
			middle: avg,
		};
	});
	return bands;
}
