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
	[key: string]: unknown;
	symbol: string;
	history: StockHistory;
}

const baseURL =
	window.location.hostname === "localhost"
		? "http://localhost:5000"
		: "https://indicatorinsights.co";

// fetches and returns StockData for a symbol and period
export async function fetchStockData(
	symbol: string,
	period: string,
	getAll: boolean = true,
	index?: string[]
): Promise<StockData> {
	try {
		// Build the URL with the necessary query parameters
		let url = `${baseURL}/api/stock/${symbol}?period=${period}&getAll=${getAll}`;

		// If the index parameter is provided, add it to the query string
		if (index && index.length > 0) {
			const indexParam = index.join(","); // Convert array to comma-separated string
			url += `&index=${indexParam}`;
		}

		// Send a request to the server and wait for its response
		const response = await fetch(url);
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

export async function fetchSummary(stockInfo: string): Promise<string> {
	try {
		const response = await fetch(
			`${baseURL}/api/generate-summary?stockInfo=${stockInfo}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			}
		);

		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		const data = await response.json();
		return data.summary;
	} catch (error) {
		console.error("Error generating summary:", error);
		throw new Error("Failed to generate summary");
	}
}

export async function fetchFinancialData(symbol: string): Promise<unknown> {
	const response = await fetch(`${baseURL}/api/financial/${symbol}`);
	const data = await response.json();
	return data;
}
