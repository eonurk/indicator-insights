import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import { RMI } from "@/utils/Indicators";
import { calculateRMIProfit } from "@/components/RMIChart";

import { stocks } from "@/utils/stocks";
import { fetchStockData } from "@/fetchStockData";
import { User } from "firebase/auth";

const periodOptions = [
	{ value: "1d", label: "1 Day" },
	{ value: "1w", label: "1 Week" },
	{ value: "1m", label: "1 Month" },
	{ value: "3m", label: "3 Months" },
	{ value: "ytd", label: "Year to Date" },
	{ value: "1y", label: "1 Year" },
	{ value: "all", label: "All" },
];

// Helper function to determine the last signal
function determineLastSignal(prices: number[], rmiData: number[]): any {
	if (rmiData.length < 2) return "No signal";
	// return { profit, buyPoints, sellPoints, latestBuyPrice };
	return calculateRMIProfit(prices, rmiData);
}
interface StockChartProps {
	user: User | null; // Use User type from firebase/auth
}
export default function IndicatorChecker({ user }: StockChartProps) {
	const [buttonDisable, setButtonDisable] = useState(false);
	const [period, setPeriod] = useState<string>("1w");
	const [indicator, setIndicator] = useState<string>("RMI");
	const [results, setResults] = useState<any[]>([]);

	const handleStart = async () => {
		try {
			setButtonDisable(true);
			// Assuming chartOptions is an object where keys are symbols and values are options

			const availableStocks = user
				? stocks
				: {
						AAPL: "Apple Inc.",
						ABNB: "Airbnb, Inc.",
						AMZN: "Amazon.com, Inc.",
						EBAY: "eBay Inc.",
						GOOGL: "Alphabet Inc. (Class A)",
						META: "Meta Platforms, Inc.",
						NFLX: "Netflix, Inc.",
						PLTR: "Palantir Technologies Inc.",
						ZM: "Zoom Video Communications, Inc.",
				  };

			const symbols = Object.keys(availableStocks);

			const response = await fetchStockData(symbols.join(","), period, false);
			const rsiResults = [];

			for (let symbol of symbols) {
				const history = response[symbol].history; // Get the historical data for the symbol
				const dates = Object.keys(history).map((date) => new Date(date));
				const closingPrices = dates
					.map((date) => history[format(date, "yyyy-MM-dd HH:mm:ss")]?.Close)
					.filter((price) => price !== undefined) as number[];

				// Call your RMI function with the extracted prices and the period
				const indicatorResult = RMI(closingPrices, 14);
				const lastSignal = determineLastSignal(closingPrices, indicatorResult);
				rsiResults.push({ symbol, indicatorResult, lastSignal, closingPrices });
			}

			setResults(rsiResults);
		} catch (error) {
			console.error("Error fetching stock data:", error);
		} finally {
			setButtonDisable(false);
		}
	};

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle>Backtest Indicator</CardTitle>
					<CardDescription>
						Check the value proposition of an indicator across all stocks with
						one-click.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form>
						<div className="grid items-center gap-4">
							<div className="flex flex-col space-y-1.5">
								<Label htmlFor="indicator">Indicator</Label>
								<Select value={indicator} onValueChange={setIndicator}>
									<SelectTrigger id="indicator">
										<SelectValue placeholder="Select" />
									</SelectTrigger>
									<SelectContent position="popper">
										<SelectItem value="RMI">RMI</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<Select value={period} onValueChange={setPeriod}>
								<SelectTrigger>
									<SelectValue placeholder="1w" />
								</SelectTrigger>
								<SelectContent position="popper">
									{periodOptions.map((option) => (
										<SelectItem key={option.value} value={option.value}>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</form>
				</CardContent>
				<CardFooter className="flex justify-between">
					<Button variant="outline">Cancel</Button>
					<Button onClick={handleStart} disabled={buttonDisable}>
						{buttonDisable && (
							<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
						)}
						Start
					</Button>
				</CardFooter>
			</Card>
			{results.length > 0 && (
				<Card className="mt-4">
					<CardContent className="p-2">
						<ScrollArea className="h-[250px] mt-2">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className="text-center p-1 pl-2">
											Stock Symbol
										</TableHead>
										<TableHead className="text-center p-1">
											Last Signal
										</TableHead>
										<TableHead className="text-center p-1">
											Signal Price
										</TableHead>
										<TableHead className="text-center p-1">
											Current Price
										</TableHead>
										<TableHead className="text-center p-1">
											Indicator Profit
										</TableHead>
									</TableRow>
								</TableHeader>

								<TableBody>
									{results.map((result) => (
										<TableRow
											key={result.symbol}
											className={
												// return { profit, buyPoints, sellPoints, latestBuyPrice };
												result.lastSignal.latestBuyPrice !== null
													? "text-green-500"
													: "text-red-500"
											}
										>
											<TableCell className="p-1">{result.symbol}</TableCell>
											<TableCell className="p-1">
												{result.lastSignal.latestBuyPrice !== null
													? "Buy"
													: "Sell"}
											</TableCell>
											<TableCell className="p-1">
												{result.lastSignal.latestBuyPrice !== null
													? result.lastSignal.latestBuyPrice.toFixed(2)
													: result.lastSignal.latestSellPrice !== null
													? result.lastSignal.latestSellPrice.toFixed(2)
													: "-"}
											</TableCell>
											<TableCell className="p-1">
												{result.closingPrices[
													result.closingPrices.length - 1
												].toFixed(2)}
											</TableCell>
											<TableCell
												className={
													result.lastSignal.profit > 0
														? "text-green-500 p-1"
														: "text-red-500 p-1"
												}
											>
												{result.lastSignal.profit.toFixed(2)}%
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</ScrollArea>
					</CardContent>
				</Card>
			)}
		</>
	);
}
