const axios = require("axios");

const baseURL =
	process.env.NODE_ENV === "development"
		? "http://localhost:5000"
		: "https://indicatorinsights.co";

// fetches and returns StockData for a symbol and period
const fetchStockData = async (symbol, period, getAll = true, index) => {
	try {
		// Build the URL with the necessary query parameters
		let url = `${baseURL}/api/stock/${symbol}?period=${period}&getAll=${getAll}`;

		// If the index parameter is provided, add it to the query string
		if (index && index.length > 0) {
			const indexParam = index.join(","); // Convert array to comma-separated string
			url += `&index=${indexParam}`;
		}

		// Send a request to the server and wait for its response
		const response = await axios.get(url);
		return response.data;
	} catch (error) {
		console.error("Error fetching stock data:", error);
		throw new Error("Failed to fetch stock data"); // or return an empty object
	}
};

// returns the percent change of a stock
const getPercentChange = (closingPrices) => {
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
};

module.exports = { fetchStockData, getPercentChange };
