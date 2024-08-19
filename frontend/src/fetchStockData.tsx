interface StockHistory {
	[date: string]: {
		Close: number;
		Open: number;
		High: number;
		Low: number;
		Volume: number;
	};
}

interface StockData {
	[key: string]: any; // Include this if you need dynamic keys
	symbol: string;
	history: StockHistory;
}

// fetches and returns StockData for a symbol and period
export async function fetchStockData(
	symbol: string,
	period: string,
	getAll: boolean = true
) {
	try {
		// send a request to the server and wait for its answer
		const response = await fetch(
			`http://localhost:5000/api/stock/${symbol}?period=${period}&getAll=${getAll}`
		);
		console.log(response);
		const data: StockData = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching stock data:", error);
		throw new Error("Failed to fetch stock data"); // or return an empty object
	}
}
// returns the percent change of a stock
export function getPercentChange(closingPrices: number[]) {
	if (closingPrices.length < 2) {
		throw new Error("Insufficient data to calculate percent change.");
	}

	const latestPrice = closingPrices[closingPrices.length - 1];
	const initialPrice = closingPrices[0];

	// Ensure initialPrice and latestPrice are defined and valid
	if (initialPrice === undefined || latestPrice === undefined) {
		throw new Error("Invalid closing prices.");
	}

	const priceChange = latestPrice - initialPrice;
	const priceChangePercentage = (priceChange / initialPrice) * 100;

	return priceChangePercentage;
}
