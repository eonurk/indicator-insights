import { marketData } from "@/utils/data";

export interface Index {
	name: string;
	yahoo: string;
}

export interface Company {
	name: string;
	symbol: string | null; // Allow null for symbol
	country: string;
	indices: string[];
	industries: string[];
	symbols?: { yahoo: string; google: string; currency: string }[]; // Optional
	metadata?: { founded: number | string; employees: number | string }; // Optional
	isins?: string[]; // Optional
	akas?: string[]; // Optional
	wiki_name?: string; // Optional
}

export interface MarketData {
	indices: Index[];
	companies: Company[];
}

export async function fetchMarketData(): Promise<MarketData> {
	return Promise.resolve(marketData);
}

// Helper function to get company names by symbols
export async function getCompanyNames(
	symbols: string[]
): Promise<Record<string, string>> {
	const marketData = await fetchMarketData();
	const companyMap = new Map(
		marketData.companies.map((company) => [company.symbol, company.name])
	);
	return Object.fromEntries(
		symbols.map((symbol) => [symbol, companyMap.get(symbol) || symbol])
	);
}

// Helper function to get all company symbols and names
export async function getAllCompanies(): Promise<Record<string, string>> {
	const marketData = await fetchMarketData();
	return Object.fromEntries(
		marketData.companies.map((company) => [company.symbol, company.name])
	);
}

// New function to get companies by index
export async function getCompaniesByIndex(
	indexName: string
): Promise<Record<string, string>> {
	const marketData = await fetchMarketData();
	const companiesInIndex = marketData.companies.filter((company) =>
		company.indices.includes(indexName)
	);
	return Object.fromEntries(
		companiesInIndex.map((company) => [company.symbol, company.name])
	);
}

// Modified function to get companies by multiple indices
export async function getCompaniesByIndices(
	indexNames: string[]
): Promise<Record<string, string>> {
	const marketData = await fetchMarketData();
	const companiesInIndices = marketData.companies.filter((company) =>
		indexNames.some((indexName) => company.indices.includes(indexName))
	);
	return Object.fromEntries(
		companiesInIndices.map((company) => [company.symbol, company.name])
	);
}

// Function to get all available indices
export async function getAvailableIndices(): Promise<string[]> {
	// const marketData = await fetchMarketData();
	// return marketData.indices.map((index) => index.name);
	// TODO: Remove this hardcoded list and use the one from the market data
	return ["NASDAQ 100", "S&P 100", "DOW JONES"];
}

// For non logged in users, we will show a default set of companies
export function getDefaultCompanies(): Record<string, string> {
	return {
		AAPL: "Apple Inc.",
		ABNB: "Airbnb, Inc.",
		AMZN: "Amazon.com, Inc.",
		EBAY: "eBay Inc.",
		GOOG: "Alphabet Inc. (Class A)",
		META: "Meta Platforms, Inc.",
		NFLX: "Netflix, Inc.",
		PLTR: "Palantir Technologies Inc.",
		ZM: "Zoom Video Communications, Inc.",
	};
}
