const axios = require("axios");
const { format } = require("date-fns");
const { fetchStockData } = require("./fetchStockData");
const { RSI, EMA, MACD, SMA, BollingerBands, RMI } = require("./Indicators");
const {
	calculateRSIProfit,
	calculateRMIProfit,
	calculateEMAProfit,
	calculateMACDProfit,
	calculateSMAProfit,
	calculateBollingerBandsProfit,
} = require("./calculateProfit");

const TELEGRAM_API_URL = "https://api.telegram.org/bot";
const BOT_TOKEN = process.env.TELEGRAM_API_KEY; // Replace with your bot token
const CHANNEL_ID = process.env.TELEGRAM_CHAT_ID; // Replace with your channel ID

const sendTelegramMessage = async (message) => {
	try {
		const response = await axios.post(
			`${TELEGRAM_API_URL}${BOT_TOKEN}/sendMessage`,
			{
				chat_id: CHANNEL_ID,
				text: message,
				parse_mode: "HTML",
			}
		);
		return response.data;
	} catch (error) {
		console.error("Error sending message to Telegram:", error);
		throw error;
	}
};

const checkForSignals = async () => {
	const symbols = [
		"AAPL",
		"MSFT",
		"AMZN",
		"NVDA",
		"GOOGL",
		"META",
		"TSLA",
		"AVGO",
		"ADBE",
		"COST",
		"PEP",
		"CSCO",
		"TMUS",
		"CMCSA",
		"TXN",
		"NFLX",
		"QCOM",
		"INTC",
		"INTU",
		"AMD",
		"HON",
		"AMAT",
		"BKNG",
		"SBUX",
		"GILD",
		"ADP",
		"MDLZ",
		"ADI",
		"PYPL",
		"REGN",
		"VRTX",
		"ISRG",
		"MNST",
		"KLAC",
		"PANW",
		"LRCX",
		"SNPS",
		"CDNS",
		"MELI",
		"ASML",
		"CHTR",
		"MAR",
		"ORLY",
		"CTAS",
		"ABNB",
		"FTNT",
		"PAYX",
		"MCHP",
		"ADSK",
		"CPRT",
		"DXCM",
		"MRNA",
		"KDP",
		"ODFL",
		"EXC",
		"AEP",
		"NXPI",
		"KHC",
		"PCAR",
		"ROST",
		"IDXX",
		"SIRI",
		"FAST",
		"EA",
		"XEL",
		"CTSH",
		"DLTR",
		"CSGP",
		"FANG",
		"VRSK",
		"WBA",
		"ANSS",
		"EBAY",
		"ZS",
		"ILMN",
		"BIIB",
		"DDOG",
		"WDAY",
		"ALGN",
		"CRWD",
		"TEAM",
		"MTCH",
		"ZM",
		"LCID",
		"RIVN",
		"ENPH",
		"CSX",
		"MU",
		"MRVL",
		"LULU",
		"AZN",
		"JD",
		"PDD",
		"BIDU",
		"WYNN",
		"DASH",
		"DOCU",
		"OKTA",
	]; // NASDAQ 100 symbols
	const period = "1d"; // Adjust the period as needed

	try {
		const response = await fetchStockData(symbols.join(","), period);
		for (const symbol of symbols) {
			if (!response[symbol] || !response[symbol].history) {
				continue;
			}
			const history = response[symbol].history;
			const dates = Object.keys(history).map((date) => new Date(date));
			const closingPrices = dates
				.map((date) => {
					const formattedDate = format(date, "yyyy-MM-dd HH:mm:ss");
					return {
						date: new Date(formattedDate),
						price: history[formattedDate]?.Close,
					};
				})
				.filter((entry) => entry.price !== undefined);

			const prices = closingPrices.map((entry) => entry.price);
			const rmi = RMI(prices, 14);
			const { latestBuyPrice, latestSellPrice } = calculateRMIProfit(
				prices,
				rmi
			);
			let message = "";
			let messageTime = new Date();

			let latestSignalDate = null;
			const currentPrice = closingPrices[closingPrices.length - 1].price;
			if (latestBuyPrice !== null) {
				const latestBuyPriceIndex = closingPrices.findIndex(
					(price) => price.price === latestBuyPrice
				);
				latestSignalDate = closingPrices[latestBuyPriceIndex].date;

				message = `<b>${symbol}</b>\nCurrent Price: $${currentPrice.toFixed(
					2
				)}\nSignal Price: $${latestBuyPrice.toFixed(
					2
				)}\nSignal: Buy\nIndicator: RMI (14)\nPeriod: ${period}\nTime: ${latestSignalDate.toLocaleString()}`;
			} else if (latestSellPrice !== null) {
				const latestSellPriceIndex = closingPrices.findIndex(
					(price) => price.price === latestSellPrice
				);
				latestSignalDate = closingPrices[latestSellPriceIndex].date;

				message = `<b>${symbol}</b>\nCurrent Price: $${currentPrice.toFixed(
					2
				)}\nSignal Price: $${latestSellPrice.toFixed(
					2
				)}\nSignal: Sell\nIndicator: RMI(14)\nPeriod: ${period}\nTime: ${latestSignalDate.toLocaleString()}`;
			}
			await sendTelegramMessage(message);
			// Check if the latest buy or sell price is within the last 5 minutes
			if (
				(latestBuyPrice !== null || latestSellPrice !== null) &&
				Date.now() - latestSignalDate.getTime() <= 5 * 60 * 1000
			) {
				// await sendTelegramMessage(message);
			} else {
				console.log("No signal within the last 5 minutes");
			}
		}
	} catch (error) {
		console.error("Error in checkForSignals:", error);
	}
};

checkForSignals();
