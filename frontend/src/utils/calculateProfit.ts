export function calculateRMIProfit(prices: number[], rmiData: number[]) {
	let capital = 100; // Start with an initial capital (can be any arbitrary value)
	let latestBuyPrice = null;
	let latestSellPrice = null;
	const buyPoints = [];
	const sellPoints = [];

	for (let i = 1; i < rmiData.length; i++) {
		// Buy signal: RSI crosses above 30
		if (rmiData[i - 1] < 30 && rmiData[i] > 30 && rmiData[i - 1] != null) {
			latestBuyPrice = prices[i];
			buyPoints.push({ x: i, y: rmiData[i], price: prices[i] });
		}
		// Sell signal: RSI crosses below 70
		else if (
			rmiData[i - 1] > 70 &&
			rmiData[i] < 70 &&
			latestBuyPrice !== null
		) {
			// Calculate profit/loss for this trade and update capital
			capital = capital * (1 + (prices[i] - latestBuyPrice) / latestBuyPrice);
			sellPoints.push({ x: i, y: rmiData[i], price: prices[i] });
			latestBuyPrice = null; // Reset after tracking the latest sell
			latestSellPrice = prices[i];
		}
	}

	// If there's an open position at the end, close it using the last price
	if (latestBuyPrice !== null) {
		capital =
			capital *
			(1 + (prices[prices.length - 1] - latestBuyPrice) / latestBuyPrice);
	}

	// Compound profit/loss is the difference between the final capital and initial capital
	const profit = capital - 100;

	return { profit, buyPoints, sellPoints, latestBuyPrice, latestSellPrice };
}

export function calculateMACDProfit(
	prices: number[],
	macdData: number[],
	signalData: number[]
) {
	let capital = 100; // Initial capital
	let latestBuyPrice: number | null = null; // Initialize as null
	let latestSellPrice: number | null = null; // Initialize as null
	const buyPoints: { x: number; y: number }[] = [];
	const sellPoints: { x: number; y: number }[] = [];

	for (let i = 1; i < macdData.length; i++) {
		// Buy signal: MACD crosses above Signal line
		if (macdData[i - 1] < signalData[i - 1] && macdData[i] > signalData[i]) {
			// Only buy if we don't have an existing buy position
			if (latestBuyPrice === null) {
				latestBuyPrice = prices[i]; // Set buy price
				buyPoints.push({ x: i, y: macdData[i] });
			}
		}
		// Sell signal: MACD crosses below Signal line
		else if (
			macdData[i - 1] > signalData[i - 1] &&
			macdData[i] < signalData[i] &&
			latestBuyPrice !== null
		) {
			latestSellPrice = prices[i]; // Set sell price
			// Calculate profit only when selling
			capital *= 1 + (latestSellPrice - latestBuyPrice) / latestBuyPrice;
			sellPoints.push({ x: i, y: macdData[i] });

			latestBuyPrice = null; // Reset buy price after selling
		}
	}

	// Close any open position at the end using the latest price
	if (latestBuyPrice !== null) {
		latestSellPrice = prices[prices.length - 1]; // Close at the last price
		capital *= 1 + (latestSellPrice - latestBuyPrice) / latestBuyPrice;
	}

	const profit = capital - 100; // Calculate profit based on initial capital

	// Guard against NaN
	if (isNaN(profit)) {
		console.error("Profit calculation resulted in NaN");
	}

	return { profit, buyPoints, sellPoints, latestBuyPrice, latestSellPrice };
}

export function calculateRSIProfit(prices: number[], rsiData: number[]) {
	let capital = 100; // Start with an initial capital
	let latestBuyPrice = null;
	let latestSellPrice = null;

	const buyPoints = [];
	const sellPoints = [];

	for (let i = 1; i < rsiData.length; i++) {
		// Buy signal: RSI crosses above 30
		if (rsiData[i - 1] < 30 && rsiData[i] > 30) {
			latestBuyPrice = prices[i];
			buyPoints.push({ x: i, y: rsiData[i] });
		}
		// Sell signal: RSI crosses below 70
		else if (
			rsiData[i - 1] > 70 &&
			rsiData[i] < 70 &&
			latestBuyPrice !== null
		) {
			if (latestBuyPrice > 0) {
				latestSellPrice = prices[i]; // Capture the sell price
				capital *= 1 + (latestSellPrice - latestBuyPrice) / latestBuyPrice;
			} else {
				console.warn(
					`Attempted to sell but latestBuyPrice was ${latestBuyPrice}`
				);
			}
			sellPoints.push({ x: i, y: rsiData[i] });
			latestBuyPrice = null; // Reset after selling
		}
	}

	// Close any open position at the end
	if (latestBuyPrice !== null && latestBuyPrice > 0) {
		latestSellPrice = prices[prices.length - 1]; // Close at the last price
		capital *= 1 + (latestSellPrice - latestBuyPrice) / latestBuyPrice;
	}

	const profit = capital - 100; // Calculate profit based on initial capital

	// Guard against NaN
	if (isNaN(profit)) {
		console.error("Profit calculation resulted in NaN");
	}

	return { profit, buyPoints, sellPoints, latestBuyPrice, latestSellPrice }; // Return both buy and sell prices
}

export function calculateEMAProfit(prices: number[], emaData: number[]) {
	let capital = 100;
	let latestBuyPrice = null;
	let latestSellPrice = null;
	const buyPoints = [];
	const sellPoints = [];

	for (let i = 1; i < emaData.length; i++) {
		// Buy signal: Price crosses above EMA
		if (prices[i - 1] < emaData[i - 1] && prices[i] > emaData[i]) {
			latestBuyPrice = prices[i];
			latestSellPrice = null;
			buyPoints.push({ x: i, y: prices[i] });
		}
		// Sell signal: Price crosses below EMA
		else if (
			prices[i - 1] > emaData[i - 1] &&
			prices[i] < emaData[i] &&
			latestBuyPrice !== null
		) {
			capital = capital * (1 + (prices[i] - latestBuyPrice) / latestBuyPrice);
			sellPoints.push({ x: i, y: prices[i] });
			latestBuyPrice = null;
			latestSellPrice = prices[i];
		}
	}

	if (latestBuyPrice !== null) {
		capital =
			capital *
			(1 + (prices[prices.length - 1] - latestBuyPrice) / latestBuyPrice);
	}

	const profit = capital - 100;
	return { profit, buyPoints, sellPoints, latestBuyPrice, latestSellPrice };
}

export function calculateSMAProfit(prices: number[], smaData: number[]) {
	let capital = 100;
	let latestBuyPrice = null;
	let latestSellPrice = null;
	const buyPoints = [];
	const sellPoints = [];

	for (let i = 1; i < smaData.length; i++) {
		// Buy signal: Price crosses above SMA
		if (prices[i - 1] < smaData[i - 1] && prices[i] > smaData[i]) {
			latestBuyPrice = prices[i];
			buyPoints.push({ x: i, y: prices[i] });
		}
		// Sell signal: Price crosses below SMA
		else if (
			prices[i - 1] > smaData[i - 1] &&
			prices[i] < smaData[i] &&
			latestBuyPrice !== null
		) {
			capital = capital * (1 + (prices[i] - latestBuyPrice) / latestBuyPrice);
			sellPoints.push({ x: i, y: prices[i] });
			latestBuyPrice = null;
			latestSellPrice = prices[i];
		}
	}

	if (latestBuyPrice !== null) {
		capital =
			capital *
			(1 + (prices[prices.length - 1] - latestBuyPrice) / latestBuyPrice);
	}

	const profit = capital - 100;
	return { profit, buyPoints, sellPoints, latestBuyPrice, latestSellPrice };
}

export function calculateBollingerBandsProfit(
	prices: number[],
	upperBand: number[],
	lowerBand: number[]
) {
	let capital = 100;
	let latestBuyPrice = null;
	let latestSellPrice = null;
	const buyPoints = [];
	const sellPoints = [];

	for (let i = 1; i < prices.length; i++) {
		// Buy signal: Price crosses below the lower band
		if (prices[i] < lowerBand[i] && prices[i - 1] >= lowerBand[i - 1]) {
			latestBuyPrice = prices[i];
			buyPoints.push({ x: i, y: prices[i] });
		}
		// Sell signal: Price crosses above the upper band
		else if (
			prices[i] > upperBand[i] &&
			prices[i - 1] <= upperBand[i - 1] &&
			latestBuyPrice !== null
		) {
			capital = capital * (1 + (prices[i] - latestBuyPrice) / latestBuyPrice);
			sellPoints.push({ x: i, y: prices[i] });
			latestBuyPrice = null;
			latestSellPrice = prices[i];
		}
	}

	if (latestBuyPrice !== null) {
		capital =
			capital *
			(1 + (prices[prices.length - 1] - latestBuyPrice) / latestBuyPrice);
	}

	const profit = capital - 100;
	return { profit, buyPoints, sellPoints, latestBuyPrice, latestSellPrice };
}

export function calculateStochRSIProfit(
	prices: number[],
	kLine: number[],
	dLine: number[]
) {
	let capital = 100;
	let latestBuyPrice = null;
	let latestSellPrice = null;
	const buyPoints = [];
	const sellPoints = [];

	for (let i = 1; i < prices.length; i++) {
		// Buy signal: %K crosses above %D and %K is below 20
		if (kLine[i] < 20 && kLine[i] > dLine[i] && kLine[i - 1] <= dLine[i - 1]) {
			latestBuyPrice = prices[i];
			buyPoints.push({ x: i, y: kLine[i] });
		}
		// Sell signal: %K crosses below %D and %K is above 80
		else if (
			kLine[i] > 80 &&
			kLine[i] < dLine[i] &&
			kLine[i - 1] >= dLine[i - 1] &&
			latestBuyPrice !== null
		) {
			capital = capital * (1 + (prices[i] - latestBuyPrice) / latestBuyPrice);
			sellPoints.push({ x: i, y: dLine[i] });
			latestBuyPrice = null;
			latestSellPrice = prices[i];
		}
	}

	if (latestBuyPrice !== null) {
		capital =
			capital *
			(1 + (prices[prices.length - 1] - latestBuyPrice) / latestBuyPrice);
	}

	const profit = capital - 100;
	return { profit, buyPoints, sellPoints, latestBuyPrice, latestSellPrice };
}
