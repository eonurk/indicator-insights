import { useEffect, useState } from "react";
import { Chart as ChartJS, Tooltip } from "chart.js";
import { SankeyController, Flow } from "chartjs-chart-sankey";
import { fetchFinancialData } from "@/fetchStockData";
import { Chart } from "react-chartjs-2";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "../ui/scroll-area";

ChartJS.register(SankeyController, Flow, Tooltip);

interface SankeyChartProps {
	selectedStock: string;
	availableStocks: Record<string, string>;
}

interface FinancialData {
	year: string;
	cost_of_revenue: number;
	gross_profit: number;
	operating_expenses: number;
	net_income: number;
	tax_provision: number;
	interest_expense: number;
	interest_income: number;
	research_and_development: number;
	selling_general_and_administration: number;
}

function SankeyChart({ selectedStock, availableStocks }: SankeyChartProps) {
	const [chartData, setChartData] = useState<{
		[year: string]: {
			nodes: string[];
			links: { source: string; target: string; value: number }[];
		};
	}>({});
	const [error, setError] = useState<string | null>(null);
	const [selectedYear, setSelectedYear] = useState<string | null>(null);
	const [symbol, setSymbol] = useState(selectedStock);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const result = (await fetchFinancialData(symbol)) as FinancialData[];

				const newChartData: {
					[year: string]: {
						nodes: string[];
						links: { source: string; target: string; value: number }[];
					};
				} = {};

				result.forEach((item: FinancialData) => {
					// Check if the year data is present
					if (!item.year) {
						console.warn("Skipping entry due to missing year data:", item);
						return;
					}

					const year = new Date(item.year).getFullYear().toString();
					if (!newChartData[year]) {
						newChartData[year] = { nodes: [], links: [] };
					}

					newChartData[year].nodes = [
						"Revenue",
						"Cost of Revenue",
						"Gross Profit",
						"Operating\nExpenses", // Line break
						"Operating\nIncome", // Line break
						"EBT",
						"Tax Provision",
						"Net Income",
						"R&D",
						"SG&A",
					];

					newChartData[year].links = [
						{
							source: "Revenue",
							target: "Cost of Revenue",
							value: item.cost_of_revenue,
						},
						{
							source: "Revenue",
							target: "Gross Profit",
							value: item.gross_profit,
						},
						{
							source: "Gross Profit",
							target: "Operating\nExpenses", // Line break
							value: item.operating_expenses,
						},
						{
							source: "Gross Profit",
							target: "Operating\nIncome", // Line break
							value: item.gross_profit - item.operating_expenses,
						},
						{
							source: "Operating\nIncome", // Line break
							target: "EBT",
							value:
								item.gross_profit -
								item.operating_expenses -
								item.interest_expense +
								item.interest_income,
						},
						{
							source: "EBT",
							target: "Tax Provision",
							value: item.tax_provision,
						},
						{ source: "EBT", target: "Net Income", value: item.net_income },
						{
							source: "Operating\nExpenses", // Line break
							target: "R&D",
							value: item.research_and_development,
						},
						{
							source: "Operating\nExpenses", // Line break
							target: "SG&A",
							value: item.selling_general_and_administration,
						},
					];
				});
				setChartData(newChartData);
				// Set the most recent year as the default selected year
				const years = Object.keys(newChartData).sort();
				setSelectedYear(years[years.length - 1]);
			} catch (error) {
				console.error("Error fetching or processing financial data:", error);
				setError("Failed to load chart data. Please try again later.");
			}
		};
		fetchData();
	}, [symbol]);

	const formatNumber = (value: number) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			notation: "compact",
			compactDisplay: "short",
		}).format(value);
	};

	if (error) {
		return (
			<Card className="w-full">
				<CardHeader>
					<CardTitle>Financial Flow Chart</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-destructive">{error}</div>
				</CardContent>
			</Card>
		);
	}

	if (Object.keys(chartData).length === 0) {
		return (
			<Card className="w-full">
				<CardHeader>
					<CardTitle>Financial Flow Chart</CardTitle>
				</CardHeader>
				<CardContent>
					<Skeleton className="w-full h-[400px]" />
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="mt-4 w-full md:w-2/3 md:mx-auto p-2 md:p-4 ">
			<CardHeader>
				<CardTitle>Financial Flow Chart</CardTitle>
				<CardDescription>
					View the financial flow chart for the selected stock and year.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="mb-4 flex gap-2 items-center justify-center">
					<Select
						value={symbol}
						onValueChange={(value) => setSymbol(value)}
						disabled={Object.keys(chartData).length === 0}
					>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Select a stock" />
						</SelectTrigger>
						<SelectContent>
							{Object.entries(availableStocks).map(([symbol, name]) => (
								<SelectItem key={symbol} value={symbol}>
									{name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Select
						value={selectedYear || ""}
						onValueChange={(value) => setSelectedYear(value)}
						disabled={Object.keys(chartData).length === 0}
					>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Select a year" />
						</SelectTrigger>
						<SelectContent>
							{Object.entries(chartData).map(([year]) => (
								<SelectItem key={year} value={year}>
									{year}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{selectedYear && chartData[selectedYear] && (
					<ScrollArea className="w-full h-[400px]">
						<div className="w-full h-[400px]">
							<Chart
								type="sankey"
								data={{
									datasets: [
										{
											label: "Financial Flow",
											data: chartData[selectedYear].links.map((link) => ({
												from: link.source,
												to: link.target,
												flow: link.value,
											})),
											colorFrom: (c) =>
												getColor(c.dataset.data[c.dataIndex].from),
											colorTo: (c) => getColor(c.dataset.data[c.dataIndex].to),
											colorMode: "gradient" as const,
											borderWidth: 0,
											borderColor: "rgba(0,0,0,0.1)",
											font: {
												size: window.innerWidth < 768 ? 10 : 12,
												family: "Inter, sans-serif",
											},
										},
									],
									labels: chartData[selectedYear].nodes,
								}}
								options={{
									responsive: true,
									maintainAspectRatio: false,
									// 90 degree flip
									rotation: 90,
									layout: {
										padding: {
											left: 0,
											right: 10,
											top: 0,
											bottom: 0,
										},
									},
									plugins: {
										tooltip: {
											callbacks: {
												label: (context) => {
													const item = context.raw as {
														from: string;
														to: string;
														flow: number;
													};
													return `${item.from} → ${item.to}: ${formatNumber(
														item.flow
													)}`;
												},
											},
										},
										legend: {
											display: false,
										},
									},
								}}
							/>
						</div>
					</ScrollArea>
				)}
			</CardContent>
			<CardFooter className="text-sm text-gray-500 text-center">
				<p>Hover over the chart to see the financial data.</p>
			</CardFooter>
		</Card>
	);
}

// Update getColor function for a more vibrant and distinct palette
function getColor(node: string) {
	const colorMap: { [key: string]: string } = {
		Revenue: "#4CAF50", // Vibrant Green
		"Cost of Revenue": "#FF5722", // Deep Orange
		"Gross Profit": "#2196F3", // Bright Blue
		"Operating\nExpenses": "#FFC107", // Line break
		"Operating\nIncome": "#9C27B0", // Line break
		"Interest Expense": "#E91E63", // Pink
		"Interest Income": "#00BCD4", // Cyan
		EBT: "#FF9800", // Orange
		"Tax Provision": "#795548", // Brown
		"Net Income": "#8BC34A", // Light Green
		"R&D": "#3F51B5", // Indigo
		"SG&A": "#009688", // Teal
	};
	return colorMap[node] || "#9E9E9E"; // Default to a neutral gray if node not found
}

export default SankeyChart;
