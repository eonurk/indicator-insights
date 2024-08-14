import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const periodOptions = [
	{ value: "1d", label: "1 Day" },
	{ value: "1w", label: "1 Week" },
	{ value: "1m", label: "1 Month" },
	{ value: "3m", label: "3 Months" },
	{ value: "ytd", label: "Year to Date" },
	{ value: "1y", label: "1 Year" },
	{ value: "all", label: "All" },
];

export default function IndicatorChecker() {
	const [period, setPeriod] = useState<string>("1w");
	return (
		<Card className="w-[320px] items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
			<CardHeader>
				<CardTitle>Backtest Indicator</CardTitle>
				<CardDescription>
					Check value proposition of an indicator across all stocks with
					one-click.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form>
					<div className="grid w-full items-center gap-4">
						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="indicator">Indicator</Label>
							<Select>
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
				<Button>Start</Button>
			</CardFooter>
		</Card>
	);
}
