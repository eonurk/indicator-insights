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

	let gains = 0;
	let losses = 0;
	const rsi: number[] = [];

	// Calculate initial average gain/loss for the first RSI period
	for (let i = 1; i < RSIperiod; i++) {
		const change = closingPrices[i] - closingPrices[i - 1];
		if (change > 0) {
			gains += change;
		} else {
			losses -= change;
		}
	}

	let avgGain = gains / (RSIperiod - 1);
	let avgLoss = losses / (RSIperiod - 1);

	// Calculate the RSI for each subsequent period
	for (let i = RSIperiod; i < closingPrices.length; i++) {
		const change = closingPrices[i] - closingPrices[i - 1];
		if (change > 0) {
			gains = change;
			losses = 0;
		} else {
			gains = 0;
			losses = -change;
		}

		avgGain = (avgGain * (RSIperiod - 1) + gains) / RSIperiod;
		avgLoss = (avgLoss * (RSIperiod - 1) + losses) / RSIperiod;

		const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
		const rsiValue = avgLoss === 0 ? 100 : 100 - 100 / (1 + rs);
		rsi.push(rsiValue);
	}

	return [...Array(RSIperiod - 1).fill(null), ...rsi];
}
export function RMI(closingPrices: number[], RMIperiod: number = 14): number[] {
	if (closingPrices.length < RMIperiod) {
		throw new Error("Insufficient data to calculate RMI");
	}

	let gains = 0;
	let losses = 0;
	const rmi: number[] = [];

	// Calculate initial average gain/loss for the first RMI period
	for (let i = RMIperiod; i < 2 * RMIperiod; i++) {
		const change = closingPrices[i] - closingPrices[i - RMIperiod];
		if (change > 0) {
			gains += change;
		} else {
			losses -= change;
		}
	}

	let avgGain = gains / (RMIperiod - 1);
	let avgLoss = losses / (RMIperiod - 1);

	// Calculate the RMI for each subsequent period
	for (let i = 2 * RMIperiod; i < closingPrices.length; i++) {
		const change = closingPrices[i] - closingPrices[i - RMIperiod];
		if (change > 0) {
			gains = change;
			losses = 0;
		} else {
			gains = 0;
			losses = -change;
		}

		avgGain = (avgGain * (RMIperiod - 1) + gains) / RMIperiod;
		avgLoss = (avgLoss * (RMIperiod - 1) + losses) / RMIperiod;

		const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
		const rmiValue = avgLoss === 0 ? 100 : 100 - 100 / (1 + rs);
		rmi.push(rmiValue);
	}

	return [...Array(RMIperiod - 1).fill(null), ...rmi];
}

export function EMA(prices: number[], period = 14): number[] {
	const multiplier = 2 / (period + 1);
	let previousEMA = prices[0]; // Start with the first price as the initial EMA
	const ema: number[] = [previousEMA];

	for (let i = 1; i < prices.length; i++) {
		const currentEMA = (prices[i] - previousEMA) * multiplier + previousEMA;
		ema.push(currentEMA);
		previousEMA = currentEMA;
	}

	return ema;
}
export function MACD(
	prices: number[],
	fastPeriod = 12,
	slowPeriod = 26,
	signalPeriod = 9
) {
	// Calculate fast and slow EMAs
	const emaFast = EMA(prices, fastPeriod);
	const emaSlow = EMA(prices, slowPeriod);

	// Calculate MACD Line
	const macdLine = emaFast.map((fast, index) => fast - emaSlow[index]);

	// Calculate Signal Line, ensuring we only take relevant MACD values
	const signalLine = EMA(macdLine.slice(slowPeriod - 1), signalPeriod);

	// Calculate Histogram
	const histogram = macdLine
		.slice(slowPeriod - 1, macdLine.length - signalPeriod + 1)
		.map((macd, index) => macd - (signalLine[index] || 0)); // Ensure we handle undefined signalLine

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
