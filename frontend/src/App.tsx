import "./App.css";
import StockChart from "@/components/StockChart";
import IndicatorChecker from "@/components/IndicatorChecker";
import logo from "@/assets/logo.png";
function App() {
	return (
		<>
			<img src={logo} alt="Logo" style={{ width: "150px", height: "auto" }} />
			<div className="h-[40rem] flex justify-center items-center px-4">
				<div className="text-2xl mx-auto font-normal text-neutral-600 dark:text-neutral-400">
					Would you make profit in the stock market using indicators?
					<div className="text-4xl motion-safe:animate-bounce">&#8964;</div>
				</div>
			</div>
			<StockChart />
			<div className="h-[40rem] flex justify-center items-center px-4">
				<div className="text-2xl mx-auto font-normal text-neutral-600 dark:text-neutral-400">
					Can you check an indicator for all stocks?
					<div className="text-4xl motion-safe:animate-bounce">&#8964;</div>
				</div>
			</div>

			<div className="h-[40rem]">
				<IndicatorChecker />
			</div>
		</>
	);
}

export default App;
