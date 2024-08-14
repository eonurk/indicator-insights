import "./App.css";
import StockChart from "@/components/StockChart";
import IndicatorChecker from "@/components/IndicatorChecker";
function App() {
	return (
		<>
			<div className="h-[40rem] flex justify-center items-center px-4">
				<div className="text-2xl mx-auto font-normal text-neutral-600 dark:text-neutral-400">
					Would you profit in the stock market with indicators?
					<div className="motion-safe:animate-bounce">&#8964;</div>
				</div>
			</div>
			<StockChart />
			<div className="h-[40rem] flex justify-center items-center px-4">
				<div className="text-2xl mx-auto font-normal text-neutral-600 dark:text-neutral-400">
					Can you check an indicator for all stocks?
					<div className="motion-safe:animate-bounce">&#8964;</div>
				</div>
			</div>
			<div className="grid justify-center items-center ">
				<IndicatorChecker />
			</div>
		</>
	);
}

export default App;
