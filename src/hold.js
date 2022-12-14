import './App.css';
import Chart from 'chart.js/auto';
import { Line } from 'react-chartjs-2';
import { Container, Row, Col, Form, InputGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';

class Option {
	constructor(flavor, position, strike, optionPrice) {
		this.flavor = flavor;
		this.position = position;
		this.strike = strike;
		this.optionPrice = optionPrice;
	}
}

export default function CreateChart() {
	let inc = 0;

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

	const [message, setMessage] = useState(0);

	const handleChange = (event) => {
		//  Get input value from "event"
		setMessage(event.target.value);
	};

	const [message2, setMessage2] = useState(0);

	const handleChange2 = (event) => {
		//  Get input value from "event"
		setMessage2(event.target.value);
	};

	let spreads = {
		'Long Call': [new Option(flavors.Call, positions.Long, parseFloat(message), parseFloat(message2))],
		'Long Put': [new Option(flavors.Put, positions.Long, 100, 5)],
		'Short Call': [new Option(flavors.Call, positions.Short, 100, 5)],
		'Short Put': [new Option(flavors.Put, positions.Short, 100, 5)],
		'Bull Spread': [new Option(flavors.Call, positions.Long, 100, 5), new Option(flavors.Call, positions.Short, 105, 2)],
		'Bear Spread': [new Option(flavors.Put, positions.Long, 100, 5), new Option(flavors.Put, positions.Short, 95, 2)],
		'Butterfly Spread': [
			new Option(flavors.Call, positions.Long, 95, 10),
			new Option(flavors.Call, positions.Short, 100, 5),
			new Option(flavors.Call, positions.Short, 100, 5),
			new Option(flavors.Call, positions.Long, 105, 2),
		],
		'Ratio Spread': [
			new Option(flavors.Call, positions.Long, 100, 10),
			new Option(flavors.Call, positions.Short, 150, 1),
			new Option(flavors.Call, positions.Short, 150, 1),
			new Option(flavors.Call, positions.Short, 150, 1),
			new Option(flavors.Call, positions.Short, 150, 1),
			new Option(flavors.Call, positions.Short, 150, 1),
			new Option(flavors.Call, positions.Short, 150, 1),
			new Option(flavors.Call, positions.Short, 150, 1),
			new Option(flavors.Call, positions.Short, 150, 1),
			new Option(flavors.Call, positions.Short, 150, 1),
			new Option(flavors.Call, positions.Short, 150, 1),
		],
		Straddle: [new Option(flavors.Put, positions.Long, 100, 5), new Option(flavors.Call, positions.Long, 100, 5)],
		Strangle: [new Option(flavors.Put, positions.Long, 95, 5), new Option(flavors.Call, positions.Long, 105, 2)],
		Strip: [
			new Option(flavors.Call, positions.Long, 100, 5),
			new Option(flavors.Put, positions.Long, 100, 5),
			new Option(flavors.Put, positions.Long, 100, 5),
		],
		Strap: [
			new Option(flavors.Put, positions.Long, 100, 5),
			new Option(flavors.Call, positions.Long, 100, 5),
			new Option(flavors.Call, positions.Long, 100, 5),
		],
		'Synthetic Long Forward': [new Option(flavors.Put, positions.Short, 100, 5), new Option(flavors.Call, positions.Long, 100, 5)],
		'Synthetic Short Forward': [new Option(flavors.Put, positions.Long, 100, 5), new Option(flavors.Call, positions.Short, 100, 5)],
		'Box Spread': [
			new Option(flavors.Put, positions.Long, 120, 5),
			new Option(flavors.Call, positions.Short, 120, 5),
			new Option(flavors.Put, positions.Short, 100, 5),
			new Option(flavors.Call, positions.Long, 100, 5),
		],
	};

	let portfolioPayoffDataArray = [];

	function createChartData(spreadName, spread) {
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
		portfolioPayoffDataArray.push([key, createChartData(key, value)]);
	});

	const chartOptions = (textName) => {
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
		};
	};

	return (
		<Container>
			<Row className='h-250'>
				<Col>
					<Line data={portfolioPayoffDataArray[inc][1]} options={chartOptions(portfolioPayoffDataArray[inc++][0])}></Line>
					<Row>
						{/* <Col>
							<Form.Label>Position</Form.Label>
							<Form.Select>
								<option>Long</option>
								<option>Short</option>
							</Form.Select>
						</Col>
						<Col>
							<Form.Label>Flavor</Form.Label>
							<Form.Select>
								<option>Call</option>
								<option>Put</option>
							</Form.Select>
						</Col> */}
						<Col>
							<Form.Label>Strike Price</Form.Label>
							<InputGroup>
								<InputGroup.Text>$</InputGroup.Text>
								<Form.Control id='strikePrice' placeholder='0' onChange={handleChange} />
							</InputGroup>
						</Col>
						<Col>
							<Form.Label>Option Price</Form.Label>
							<InputGroup>
								<InputGroup.Text>$</InputGroup.Text>
								<Form.Control id='optionPrice' placeholder='0' onChange={handleChange2} />
							</InputGroup>
						</Col>
					</Row>
				</Col>
				{/* <Col>
					<Line data={portfolioPayoffDataArray[inc][1]} options={chartOptions(portfolioPayoffDataArray[inc++][0])}></Line>
				</Col> */}
			</Row>

			{/* <Row className='h-250'>
				<Col>
					<Line data={portfolioPayoffDataArray[inc][1]} options={chartOptions(portfolioPayoffDataArray[inc++][0])}></Line>
				</Col>
				<Col>
					<Line data={portfolioPayoffDataArray[inc][1]} options={chartOptions(portfolioPayoffDataArray[inc++][0])}></Line>
				</Col>
			</Row>

			<Row className='h-250'>
				<Col>
					<Line data={portfolioPayoffDataArray[inc][1]} options={chartOptions(portfolioPayoffDataArray[inc++][0])}></Line>
				</Col>
				<Col>
					<Line data={portfolioPayoffDataArray[inc][1]} options={chartOptions(portfolioPayoffDataArray[inc++][0])}></Line>
				</Col>
			</Row>

			<Row className='h-250'>
				<Col>
					<Line data={portfolioPayoffDataArray[inc][1]} options={chartOptions(portfolioPayoffDataArray[inc++][0])}></Line>
				</Col>
				<Col>
					<Line data={portfolioPayoffDataArray[inc][1]} options={chartOptions(portfolioPayoffDataArray[inc++][0])}></Line>
				</Col>
			</Row>

			<Row className='h-250'>
				<Col>
					<Line data={portfolioPayoffDataArray[inc][1]} options={chartOptions(portfolioPayoffDataArray[inc++][0])}></Line>
				</Col>
				<Col>
					<Line data={portfolioPayoffDataArray[inc][1]} options={chartOptions(portfolioPayoffDataArray[inc++][0])}></Line>
				</Col>
			</Row>

			<Row className='h-250'>
				<Col>
					<Line data={portfolioPayoffDataArray[inc][1]} options={chartOptions(portfolioPayoffDataArray[inc++][0])}></Line>
				</Col>
				<Col>
					<Line data={portfolioPayoffDataArray[inc][1]} options={chartOptions(portfolioPayoffDataArray[inc++][0])}></Line>
				</Col>
			</Row>
			<Row className='h-250'>
				<Col>
					<Line data={portfolioPayoffDataArray[inc][1]} options={chartOptions(portfolioPayoffDataArray[inc++][0])}></Line>
				</Col>
				<Col>
					<Line data={portfolioPayoffDataArray[inc][1]} options={chartOptions(portfolioPayoffDataArray[inc++][0])}></Line>
				</Col>
			</Row>

			<Row className='h-250'>
				<Col>
					<Line data={portfolioPayoffDataArray[inc][1]} options={chartOptions(portfolioPayoffDataArray[inc++][0])}></Line>
				</Col>
				<Col></Col>
			</Row> */}
		</Container>
	);
}
