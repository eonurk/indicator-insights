const getTimeUnit = (period: string) => {
	switch (period) {
		case "1d":
			return "minute";
		case "1w":
		case "1m":
		case "3m":
		case "ytd":
		case "1y":
			return "day";
		case "all":
			return "month";
		default:
			return "day";
	}
};

export function chartOptions(period: string) {
	return {
		elements: {
			point: {
				radius: 0,
			},
			line: {
				borderWidth: 10,
				tension: 0.1,
			},
		},
		scales: {
			x: {
				type: "timeseries",
				time: {
					unit: getTimeUnit(period),
					tooltipFormat: "MMM d, yyyy",
				},
				ticks: {
					source: "labels",
					autoSkip: true,
					maxTicksLimit: 10,
				},
				grid: {
					display: false,
					drawBorder: false,
				},
			},
			y: {
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
				display: false,
			},
		},
		backgroundColor: "transparent",
	};
}
