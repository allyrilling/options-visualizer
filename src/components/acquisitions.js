import Chart from 'chart.js/auto';

(function (chartOptions, customPortfolioChartData) {
	let ctx = document.getElementById('acquisitions');
	if (ctx) {
		new Chart(ctx, {
			type: 'line',
			options: chartOptions('Custom Spread'),
			data: customPortfolioChartData,
		});
	}
})();
