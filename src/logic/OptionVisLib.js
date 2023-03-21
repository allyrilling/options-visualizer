export const flavors = {
	Call: 'Call',
	Put: 'Put',
};

export const positions = {
	Long: 'Long',
	Short: 'Short',
};

export function grossPayoff(option, spotT) {
	if (option.flavor === flavors.Call) {
		return Math.max(spotT - option.strike, 0);
	} else if (option.flavor === flavors.Put) {
		return Math.max(option.strike - spotT, 0);
	} else {
		console.log('Gross payoff error');
		return -1;
	}
}

export function netPayoff(option, spotT) {
	let gp = grossPayoff(option, spotT);
	if (option.position === positions.Long) {
		return gp - option.optionPrice;
	} else if (option.position === positions.Short) {
		return option.optionPrice - gp;
	} else {
		console.log('Net payoff error');
		return -1;
	}
}

export function determineHighestStrike(options) {
	let highestStrike = -1;
	for (let i = 0; i < options.length; i++) {
		if (options[i].strike > highestStrike) {
			highestStrike = options[i].strike;
		}
	}
	return highestStrike;
}

export function portfolioPayoff(options, spotPrices) {
	if (spotPrices) {
		let pp = []; // pp at each spot price
		let spots = spotPrices(options);
		for (let s = 0; s < spots.length; s++) {
			let ppAtS = 0;
			for (let o = 0; o < options.length; o++) {
				ppAtS += netPayoff(options[o], spots[s]);
			}
			pp.push(ppAtS);
		}
		return pp;
	}
}

export function createChartData(spreadName, spread, quantities, spotPrices) {
	if (spotPrices) {
		let payoffs;
		if (quantities == null) {
			payoffs = portfolioPayoff(spread, spotPrices); // y vals
		} else {
			let linearOptions = [];
			for (let i = 0; i < quantities.length; i++) {
				for (let j = 0; j < quantities[i]; j++) {
					linearOptions.push(spread[i]);
				}
			}
			payoffs = portfolioPayoff(linearOptions, spotPrices);
		}

		return {
			labels: spotPrices(spread),
			datasets: [
				{
					label: spreadName,
					data: payoffs,
					fill: true,
					borderColor: 'red',
					tension: 0.1,
				},
			],
		};
	}
}

export const chartOptions = (textName) => {
	return {
		plugins: {
			title: {
				display: true,
				text: textName,
				font: { size: 30 },
			},
			legend: {
				display: false,
			},
			tooltip: {
				enabled: true,
			},
		},
		scales: {
			y: {
				title: {
					display: true,
					text: 'Payoff',
				},
			},
			x: {
				title: {
					display: true,
					text: 'Spot Price',
				},
			},
		},
	};
};
