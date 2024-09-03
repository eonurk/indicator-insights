interface RiskWeatherProps {
	portfolioRisk: number; // 0-100
}

const RiskWeather: React.FC<RiskWeatherProps> = ({ portfolioRisk }) => {
	const getColor = (risk: number) => {
		if (risk < 25) return "bg-green-500";
		if (risk < 50) return "bg-yellow-500";
		if (risk < 75) return "bg-orange-500";
		return "bg-red-500";
	};

	const getLabel = (risk: number) => {
		if (risk < 25) return "Low";
		if (risk < 50) return "Moderate";
		if (risk < 75) return "High";
		return "Extreme";
	};

	return (
		<div className="flex items-center space-x-4">
			<div className="flex items-center space-x-2">
				<div className="text-sm font-medium text-gray-600">Volatility:</div>
				<div className="relative w-24 h-4 mt-0.5 bg-gray-200 rounded-full overflow-hidden group">
					<div
						className={`absolute top-0 left-0 h-full rounded-full transition-all duration-300 ease-in-out ${getColor(
							portfolioRisk
						)}`}
						style={{ width: `${portfolioRisk}%` }}
					></div>
					<div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-xs font-bold text-white">
						{getLabel(portfolioRisk)}
					</div>
					<div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
						Score: {portfolioRisk.toFixed(1)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default RiskWeather;
