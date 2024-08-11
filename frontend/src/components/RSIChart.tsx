import { Line } from "react-chartjs-2";

const rsiChartOptions = {
	elements: {
		point: {
			radius: 0,
		},
		line: {
			borderWidth: 2,
			tension: 0.1,
		},
	},
	scales: {
		x: {
			type: "time",
			time: {
				unit: "day",
				tooltipFormat: "MMM d, yyyy",
			},
			ticks: {
				autoSkip: true,
				maxTicksLimit: 10,
			},
			grid: {
				display: false,
			},
		},
		y: {
			beginAtZero: true,
			min: 0,
			max: 100, // RSI is between 0 and 100
			grid: {
				drawBorder: false,
				display: true,
			},
			ticks: {
				autoSkip: true,
				maxTicksLimit: 10,
			},
		},
	},
	responsive: true,
	plugins: {
		tooltip: {
			mode: "index",
			intersect: false,
			backgroundColor: "rgba(0, 0, 0, 0.7)",
		},
		legend: {
			display: true,
		},
	},
	backgroundColor: "transparent",
};

function RSIChart(data: any) {
	return <Line data={data} options={rsiChartOptions} />;
}

export default RSIChart;
