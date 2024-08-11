// Utility function to fetch stock data
const fetchStockData = async (symbol: string) => {
	try {
		const response = await fetch(`http://localhost:5000/api/stock/${symbol}`);
		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching stock data:", error);
		return null;
	}
};

export default fetchStockData;
