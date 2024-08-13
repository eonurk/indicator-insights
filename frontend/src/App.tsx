import "./App.css";
import StockChart from "@/components/StockChart";

function App() {
	return (
		<>
			<div className="h-[40rem] flex justify-center items-center px-4">
				<div className="text-3xl mx-auto font-normal text-neutral-600 dark:text-neutral-400">
					Would you make money in the stock market with indicators?
					<br />
					&#8964;
				</div>
			</div>
			<StockChart />
		</>
	);
}

export default App;
