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

	//-------------------------------------------------------------------------------
	// PUT CAL STATE CODE
	//-------------------------------------------------------------------------------

	const [strikePrice_LC, set_strikePrice_LC] = useState(100);
	const [optionPrice_LC, set_optionPrice_LC] = useState(10);
	const [strikePrice_LP, set_strikePrice_LP] = useState(100);
	const [optionPrice_LP, set_optionPrice_LP] = useState(10);
	const [strikePrice_SC, set_strikePrice_SC] = useState(100);
	const [optionPrice_SC, set_optionPrice_SC] = useState(10);
	const [strikePrice_SP, set_strikePrice_SP] = useState(100);
	const [optionPrice_SP, set_optionPrice_SP] = useState(10);

	let spreads = {
		'Long Call': [new Option(flavors.Call, positions.Long, parseFloat(strikePrice_LC), parseFloat(optionPrice_LC))],
		'Long Put': [new Option(flavors.Put, positions.Long, parseFloat(strikePrice_LP), parseFloat(optionPrice_LP))],
		'Short Call': [new Option(flavors.Call, positions.Short, parseFloat(strikePrice_SC), parseFloat(optionPrice_SC))],
		'Short Put': [new Option(flavors.Put, positions.Short, parseFloat(strikePrice_SP), parseFloat(optionPrice_SP))],
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

	function createChartData(spreadName, spread, quantities) {
		let payoffs;
		if (quantities == null) {
			payoffs = portfolioPayoff(spread); // y vals
		} else {
			let linearOptions = [];
			for (let i = 0; i < quantities.length; i++) {
				for (let j = 0; j < quantities[i]; j++) {
					linearOptions.push(spread[i]);
				}
			}
			payoffs = portfolioPayoff(linearOptions);
		}

		return {
			labels: spotPrices,
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

	//-------------------------------------------------------------------------------
	// CUSTOM SPREAD STATE CODE
	//-------------------------------------------------------------------------------

	const [qty1, setQty1] = useState(1);
	const [position1, setPosition1] = useState(positions.Long);
	const [flavor1, setFlavor1] = useState(flavors.Call);
	const [strikePrice1, setStrikePrice1] = useState(100);
	const [optionPrice1, setOptionPrice1] = useState(10);

	const [qty2, setQty2] = useState(1);
	const [position2, setPosition2] = useState(positions.Short);
	const [flavor2, setFlavor2] = useState(flavors.Call);
	const [strikePrice2, setStrikePrice2] = useState(100);
	const [optionPrice2, setOptionPrice2] = useState(10);

	const [qty3, setQty3] = useState(0);
	const [position3, setPosition3] = useState(positions.Long);
	const [flavor3, setFlavor3] = useState(flavors.Call);
	const [strikePrice3, setStrikePrice3] = useState(0);
	const [optionPrice3, setOptionPrice3] = useState(0);

	const [qty4, setQty4] = useState(0);
	const [position4, setPosition4] = useState(positions.Long);
	const [flavor4, setFlavor4] = useState(flavors.Call);
	const [strikePrice4, setStrikePrice4] = useState(0);
	const [optionPrice4, setOptionPrice4] = useState(0);

	let customSpread = [
		new Option(flavor1, position1, parseFloat(strikePrice1), parseFloat(optionPrice1)),
		new Option(flavor2, position2, parseFloat(strikePrice2), parseFloat(optionPrice2)),
		new Option(flavor3, position3, parseFloat(strikePrice3), parseFloat(optionPrice3)),
		new Option(flavor4, position4, parseFloat(strikePrice4), parseFloat(optionPrice4)),
	];
	let quantities = [qty1, qty2, qty3, qty4];
	let customPortfolioChartData = createChartData('Custom Spread', customSpread, quantities);

	return (
		<Container>
			<p></p>
			<h1>Bucky's Options</h1>
			{/* --------------------------------------------------------------------------- 				Custom Spread
			------------------------------------------------------------------------------- */}
			<Row className='h-250'>
				<Col>
					<Line data={customPortfolioChartData} options={chartOptions('Custom Spread')}></Line>
					<Row>
						<Col>
							<Form.Label>Quantitiy</Form.Label>
							<InputGroup>
								<InputGroup.Text>#</InputGroup.Text>
								<Form.Control id='strikePrice' placeholder={qty1} onChange={(event) => setQty1(event.target.value)} />
							</InputGroup>
						</Col>
						<Col>
							<Form.Label>Position</Form.Label>
							<Form.Select placeholder={position1} onChange={(event) => setPosition1(event.target.value)}>
								<option selected>{positions.Long}</option>
								<option>{positions.Short}</option>
							</Form.Select>
						</Col>
						<Col>
							<Form.Label>Flavor</Form.Label>
							<Form.Select placeholder={flavor1} onChange={(event) => setFlavor1(event.target.value)}>
								<option selected>{flavors.Call}</option>
								<option>{flavors.Put}</option>
							</Form.Select>
						</Col>
						<Col>
							<Form.Label>Strike Price</Form.Label>
							<InputGroup>
								<InputGroup.Text>$</InputGroup.Text>
								<Form.Control id='strikePrice' placeholder={strikePrice1} onChange={(event) => setStrikePrice1(event.target.value)} />
							</InputGroup>
						</Col>
						<Col>
							<Form.Label>Option Price</Form.Label>
							<InputGroup>
								<InputGroup.Text>$</InputGroup.Text>
								<Form.Control id='optionPrice' placeholder={optionPrice1} onChange={(event) => setOptionPrice1(event.target.value)} />
							</InputGroup>
						</Col>
					</Row>

					<Row>
						<Col>
							<Form.Label>Quantitiy</Form.Label>
							<InputGroup>
								<InputGroup.Text>#</InputGroup.Text>
								<Form.Control id='strikePrice' placeholder={qty2} onChange={(event) => setQty2(event.target.value)} />
							</InputGroup>
						</Col>
						<Col>
							<Form.Label>Position</Form.Label>
							<Form.Select placeholder={position2} onChange={(event) => setPosition2(event.target.value)}>
								<option>{positions.Long}</option>
								<option selected>{positions.Short}</option>
							</Form.Select>
						</Col>
						<Col>
							<Form.Label>Flavor</Form.Label>
							<Form.Select placeholder={flavor2} onChange={(event) => setFlavor2(event.target.value)}>
								<option>{flavors.Call}</option>
								<option selected>{flavors.Put}</option>
							</Form.Select>
						</Col>
						<Col>
							<Form.Label>Strike Price</Form.Label>
							<InputGroup>
								<InputGroup.Text>$</InputGroup.Text>
								<Form.Control id='strikePrice' placeholder={strikePrice2} onChange={(event) => setStrikePrice2(event.target.value)} />
							</InputGroup>
						</Col>
						<Col>
							<Form.Label>Option Price</Form.Label>
							<InputGroup>
								<InputGroup.Text>$</InputGroup.Text>
								<Form.Control id='optionPrice' placeholder={optionPrice2} onChange={(event) => setOptionPrice2(event.target.value)} />
							</InputGroup>
						</Col>
					</Row>

					<Row>
						<Col>
							<Form.Label>Quantitiy</Form.Label>
							<InputGroup>
								<InputGroup.Text>#</InputGroup.Text>
								<Form.Control id='strikePrice' placeholder={qty3} onChange={(event) => setQty3(event.target.value)} />
							</InputGroup>
						</Col>
						<Col>
							<Form.Label>Position</Form.Label>
							<Form.Select placeholder={position3} onChange={(event) => setPosition3(event.target.value)}>
								<option>{positions.Long}</option>
								<option>{positions.Short}</option>
							</Form.Select>
						</Col>
						<Col>
							<Form.Label>Flavor</Form.Label>
							<Form.Select placeholder={flavor3} onChange={(event) => setFlavor3(event.target.value)}>
								<option>{flavors.Call}</option>
								<option>{flavors.Put}</option>
							</Form.Select>
						</Col>
						<Col>
							<Form.Label>Strike Price</Form.Label>
							<InputGroup>
								<InputGroup.Text>$</InputGroup.Text>
								<Form.Control id='strikePrice' placeholder={strikePrice3} onChange={(event) => setStrikePrice3(event.target.value)} />
							</InputGroup>
						</Col>
						<Col>
							<Form.Label>Option Price</Form.Label>
							<InputGroup>
								<InputGroup.Text>$</InputGroup.Text>
								<Form.Control id='optionPrice' placeholder={optionPrice3} onChange={(event) => setOptionPrice3(event.target.value)} />
							</InputGroup>
						</Col>
					</Row>

					<Row>
						<Col>
							<Form.Label>Quantitiy</Form.Label>
							<InputGroup>
								<InputGroup.Text>#</InputGroup.Text>
								<Form.Control id='strikePrice' placeholder={qty4} onChange={(event) => setQty4(event.target.value)} />
							</InputGroup>
						</Col>
						<Col>
							<Form.Label>Position</Form.Label>
							<Form.Select placeholder={position4} onChange={(event) => setPosition4(event.target.value)}>
								<option>{positions.Long}</option>
								<option>{positions.Short}</option>
							</Form.Select>
						</Col>
						<Col>
							<Form.Label>Flavor</Form.Label>
							<Form.Select placeholder={flavor4} onChange={(event) => setFlavor4(event.target.value)}>
								<option>{flavors.Call}</option>
								<option>{flavors.Put}</option>
							</Form.Select>
						</Col>
						<Col>
							<Form.Label>Strike Price</Form.Label>
							<InputGroup>
								<InputGroup.Text>$</InputGroup.Text>
								<Form.Control id='strikePrice' placeholder={strikePrice4} onChange={(event) => setStrikePrice4(event.target.value)} />
							</InputGroup>
						</Col>
						<Col>
							<Form.Label>Option Price</Form.Label>
							<InputGroup>
								<InputGroup.Text>$</InputGroup.Text>
								<Form.Control id='optionPrice' placeholder={optionPrice4} onChange={(event) => setOptionPrice4(event.target.value)} />
							</InputGroup>
						</Col>
					</Row>
				</Col>
			</Row>
			<p></p>
			<h1>Naked Options</h1>
			{/* --------------------------------------------------------------------------- 				Static Options
			------------------------------------------------------------------------------- */}
			<Row className='h-250'>
				<Col>
					<Line data={portfolioPayoffDataArray[inc][1]} options={chartOptions(portfolioPayoffDataArray[inc++][0])}></Line>
					<Row>
						<Col>
							<Form.Label>Strike Price</Form.Label>
							<InputGroup>
								<InputGroup.Text>$</InputGroup.Text>
								<Form.Control id='strikePrice' placeholder={strikePrice_LC} onChange={(event) => set_strikePrice_LC(event.target.value)} />
							</InputGroup>
						</Col>
						<Col>
							<Form.Label>Option Price</Form.Label>
							<InputGroup>
								<InputGroup.Text>$</InputGroup.Text>
								<Form.Control id='optionPrice' placeholder={optionPrice_LC} onChange={(event) => set_optionPrice_LC(event.target.value)} />
							</InputGroup>
						</Col>
					</Row>
				</Col>
				<Col>
					<Line data={portfolioPayoffDataArray[inc][1]} options={chartOptions(portfolioPayoffDataArray[inc++][0])}></Line>
					<Row>
						<Col>
							<Form.Label>Strike Price</Form.Label>
							<InputGroup>
								<InputGroup.Text>$</InputGroup.Text>
								<Form.Control id='strikePrice' placeholder={strikePrice_LP} onChange={(event) => set_strikePrice_LP(event.target.value)} />
							</InputGroup>
						</Col>
						<Col>
							<Form.Label>Option Price</Form.Label>
							<InputGroup>
								<InputGroup.Text>$</InputGroup.Text>
								<Form.Control id='optionPrice' placeholder={optionPrice_LP} onChange={(event) => set_optionPrice_LP(event.target.value)} />
							</InputGroup>
						</Col>
					</Row>
				</Col>
			</Row>
			<Row className='h-250'>
				<Col>
					<Line data={portfolioPayoffDataArray[inc][1]} options={chartOptions(portfolioPayoffDataArray[inc++][0])}></Line>
					<Row>
						<Col>
							<Form.Label>Strike Price</Form.Label>
							<InputGroup>
								<InputGroup.Text>$</InputGroup.Text>
								<Form.Control id='strikePrice' placeholder={strikePrice_SC} onChange={(event) => set_strikePrice_SC(event.target.value)} />
							</InputGroup>
						</Col>
						<Col>
							<Form.Label>Option Price</Form.Label>
							<InputGroup>
								<InputGroup.Text>$</InputGroup.Text>
								<Form.Control id='optionPrice' placeholder={optionPrice_SC} onChange={(event) => set_optionPrice_SC(event.target.value)} />
							</InputGroup>
						</Col>
					</Row>
				</Col>
				<Col>
					<Line data={portfolioPayoffDataArray[inc][1]} options={chartOptions(portfolioPayoffDataArray[inc++][0])}></Line>
					<Row>
						<Col>
							<Form.Label>Strike Price</Form.Label>
							<InputGroup>
								<InputGroup.Text>$</InputGroup.Text>
								<Form.Control id='strikePrice' placeholder={strikePrice_SP} onChange={(event) => set_strikePrice_SP(event.target.value)} />
							</InputGroup>
						</Col>
						<Col>
							<Form.Label>Option Price</Form.Label>
							<InputGroup>
								<InputGroup.Text>$</InputGroup.Text>
								<Form.Control id='optionPrice' placeholder={optionPrice_SP} onChange={(event) => set_optionPrice_SP(event.target.value)} />
							</InputGroup>
						</Col>
					</Row>
				</Col>
			</Row>
			<p></p>
			<h1>Spreads</h1>
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
			</Row>
		</Container>
	);
}
