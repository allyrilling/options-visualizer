import './App.css';
import Chart from 'chart.js/auto';
import { Line } from 'react-chartjs-2';

class Option {
	constructor(flavor, position, strike, optionPrice) {
		this.flavor = flavor;
		this.position = position;
		this.strike = strike;
		this.optionPrice = optionPrice;
	}
}

const flavors = {
	Call: 'Call',
	Put: 'Put',
};

const positions = {
	Long: 'Long',
	Short: 'Short',
};

function grossPayoff(option, spotT) {
	if (option.flavor == flavors.Call) {
		return Math.max(spotT - option.strike, 0);
	} else if (option.flavor == flavors.Put) {
		return Math.max(option.strike - spotT, 0);
	} else {
		console.log('Gross payoff error');
		return -1;
	}
}

function netPayoff(option, spotT) {
	let gp = grossPayoff(option, spotT);
	if (option.position == positions.Long) {
		return gp - option.optionPrice;
	} else if (option.position == positions.Short) {
		return option.optionPrice - gp;
	} else {
		console.log('Net payoff error');
		return -1;
	}
}

// x vals
let spotPrices = (() => {
	let list = [];
	for (let i = 0; i < 200; i++) {
		list.push(i);
	}
	return list;
})();

function portfolioPayoff(options) {
	let pp = []; // pp at each spot price
	for (let s = 0; s < spotPrices.length; s++) {
		let ppAtS = 0;
		for (let o = 0; o < options.length; o++) {
			ppAtS += netPayoff(options[o], s);
		}
		pp.push(ppAtS);
	}
	return pp;
}

let spreads = {
	'Bull Spread': [new Option(flavors.Call, positions.Long, 100, 5), new Option(flavors.Call, positions.Short, 105, 2)],
	'Bear Spread': [new Option(flavors.Put, positions.Long, 100, 5), new Option(flavors.Put, positions.Short, 95, 2)],
	'Butterfly Spread': [
		new Option(flavors.Call, positions.Long, 95, 10),
		new Option(flavors.Call, positions.Short, 100, 5),
		new Option(flavors.Call, positions.Short, 100, 5),
		new Option(flavors.Call, positions.Long, 105, 2),
	],
};

let portfolioPayoffDataArray = [];

function createChart(spreadName, spread) {
	let payoffs = portfolioPayoff(spread); // y vals

	return {
		labels: spotPrices,
		datasets: [
			{
				label: spreadName,
				data: payoffs,
				fill: true,
				borderColor: 'rgb(75, 192, 192)',
				tension: 0.1,
			},
		],
	};
}

Object.entries(spreads).forEach(([key, value]) => {
	portfolioPayoffDataArray.push(createChart(key, value));
});

const payoffsChart = () => {
	return (
		<div>
			<Line data={portfolioPayoffDataArray[0]} options={{ plugins: { title: { display: true, text: 'test' } } }}></Line>
			<Line data={portfolioPayoffDataArray[1]}></Line>
			<Line data={portfolioPayoffDataArray[2]}></Line>
		</div>
	);
};

export default payoffsChart;
