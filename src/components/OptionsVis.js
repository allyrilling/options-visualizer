import '../css/App.css';
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
	let spotPrices = (options) => {
		let list = [];
		let inc = 1;
		let highestStrike = determineHighestStrike(options);
		if (highestStrike > 10000) {
			inc = highestStrike / 100;
		} else if (highestStrike > 1000) {
			inc = highestStrike / 10;
		}
		for (let i = 0; i < highestStrike * 2 + 1; i += inc) {
			list.push(i);
		}
		return list;
	};

	function determineHighestStrike(options) {
		let highestStrike = -1;
		for (let i = 0; i < options.length; i++) {
			if (options[i].strike > highestStrike) {
				highestStrike = options[i].strike;
			}
		}
		return highestStrike;
	}

	function portfolioPayoff(options) {
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
		'Bull Spread': [new Option(flavors.Call, positions.Long, 90, 5), new Option(flavors.Call, positions.Short, 110, 2)],
		'Bear Spread': [new Option(flavors.Put, positions.Long, 110, 5), new Option(flavors.Put, positions.Short, 90, 2)],
		'Butterfly Spread': [
			new Option(flavors.Call, positions.Long, 80, 10),
			new Option(flavors.Call, positions.Short, 100, 5),
			new Option(flavors.Call, positions.Short, 100, 5),
			new Option(flavors.Call, positions.Long, 120, 2),
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
		Straddle: [new Option(flavors.Put, positions.Long, 100, 10), new Option(flavors.Call, positions.Long, 100, 10)],
		Strangle: [new Option(flavors.Put, positions.Long, 90, 10), new Option(flavors.Call, positions.Long, 110, 10)],
		Strip: [
			new Option(flavors.Call, positions.Long, 100, 20),
			new Option(flavors.Put, positions.Long, 100, 20),
			new Option(flavors.Put, positions.Long, 100, 20),
		],
		Strap: [
			new Option(flavors.Put, positions.Long, 100, 20),
			new Option(flavors.Call, positions.Long, 100, 20),
			new Option(flavors.Call, positions.Long, 100, 20),
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

	const [qty2, setQty2] = useState(0);
	const [position2, setPosition2] = useState(positions.Long);
	const [flavor2, setFlavor2] = useState(flavors.Call);
	const [strikePrice2, setStrikePrice2] = useState(0);
	const [optionPrice2, setOptionPrice2] = useState(0);

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
			<h1>Options Visualizer</h1>
			{/* --------------------------------------------------------------------------- 				Custom Spread
			------------------------------------------------------------------------------- */}
			<Row className='h-250'>
				<Col>
					<Line data={customPortfolioChartData} options={chartOptions('Custom Spread')}></Line>
					<Row>
						{/* <Col>
							<Form.Label className='fw-bold'>{optionName1}</Form.Label>
							<InputGroup>
								<Button variant='outline-danger'>{qty1 > 0 ? 'Update' : 'Add'}</Button>
								<Form.Control placeholder='Option Name' on/>
							</InputGroup>
						</Col> */}
						<Col>
							<Form.Label>Quantity</Form.Label>
							<InputGroup>
								<InputGroup.Text>#</InputGroup.Text>
								<Form.Control id='strikePrice' placeholder={qty1} onChange={(event) => setQty1(event.target.value)} />
							</InputGroup>
						</Col>
						<Col>
							<Form.Label>Position</Form.Label>
							<Form.Select placeholder={position1} onChange={(event) => setPosition1(event.target.value)}>
								<option>{positions.Long}</option>
								<option>{positions.Short}</option>
							</Form.Select>
						</Col>
						<Col>
							<Form.Label>Flavor</Form.Label>
							<Form.Select placeholder={flavor1} onChange={(event) => setFlavor1(event.target.value)}>
								<option>{flavors.Call}</option>
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
							<Form.Label>Quantity</Form.Label>
							<InputGroup>
								<InputGroup.Text>#</InputGroup.Text>
								<Form.Control id='strikePrice' placeholder={qty2} onChange={(event) => setQty2(event.target.value)} />
							</InputGroup>
						</Col>
						<Col>
							<Form.Label>Position</Form.Label>
							<Form.Select placeholder={position2} onChange={(event) => setPosition2(event.target.value)}>
								<option>{positions.Long}</option>
								<option>{positions.Short}</option>
							</Form.Select>
						</Col>
						<Col>
							<Form.Label>Flavor</Form.Label>
							<Form.Select placeholder={flavor2} onChange={(event) => setFlavor2(event.target.value)}>
								<option>{flavors.Call}</option>
								<option>{flavors.Put}</option>
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
							<Form.Label>Quantity</Form.Label>
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
							<Form.Label>Quantity</Form.Label>
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
				<Form.Text muted>Note: Quantities greater than 10,000 cause significnat slow-downs in graph rendering.</Form.Text>
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

// import '../css/App.css';
// import { Container, Row, Col, Form, InputGroup } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { useState } from 'react';
// import { Chart, Line } from 'react-chartjs-2';
// import { Chart as ChartJS, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Filler } from 'chart.js';
// import Option from '../logic/Option.js';
// import * as ovl from '../logic/OptionVisLib.js';
// import OVInput from './OVInput.js';

// ChartJS.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Filler);

// export default function CreateChart() {
// 	// x vals
// 	let spotPrices = (options) => {
// 		let list = [];
// 		let inc = 1;
// 		let highestStrike = ovl.determineHighestStrike(options);
// 		if (highestStrike > 10000) {
// 			inc = highestStrike / 100;
// 		} else if (highestStrike > 1000) {
// 			inc = highestStrike / 10;
// 		}
// 		for (let i = 0; i < highestStrike * 2 + 1; i += inc) {
// 			list.push(i);
// 		}
// 		return list;
// 	};

// 	let callback = function (setQty, setPos, setFlav, setK, setOP) {
// 		return (q, pos, flav, k, op) => {
// 			setQty(q);
// 			setPos(pos);
// 			setFlav(flav);
// 			setK(k);
// 			setOP(op);
// 		};
// 	};

// 	const [qty1, setQty1] = useState(1);
// 	const [position1, setPosition1] = useState(ovl.positions.Long);
// 	const [flavor1, setFlavor1] = useState(ovl.flavors.Call);
// 	const [strikePrice1, setStrikePrice1] = useState(100);
// 	const [optionPrice1, setOptionPrice1] = useState(10);

// 	// let callback1 = function (q, p, f, k, op) {
// 	// 	setQty1(q);
// 	// 	setPosition1(p);
// 	// 	setFlavor1(f);
// 	// 	setStrikePrice1(k);
// 	// 	setOptionPrice1(op);
// 	// };

// 	// todo no idea why this doesnt work, it isnt passing the reference to these functions to the child

// 	let callback1 = callback(setQty1, setFlavor1, setPosition1, setStrikePrice1, setOptionPrice1);

// 	const [qty2, setQty2] = useState(0);
// 	const [position2, setPosition2] = useState(ovl.positions.Long);
// 	const [flavor2, setFlavor2] = useState(ovl.flavors.Call);
// 	const [strikePrice2, setStrikePrice2] = useState(0);
// 	const [optionPrice2, setOptionPrice2] = useState(0);

// 	let callback2 = callback(setQty2, setFlavor2, setPosition2, setStrikePrice2, setOptionPrice2);

// 	const [qty3, setQty3] = useState(0);
// 	const [position3, setPosition3] = useState(ovl.positions.Long);
// 	const [flavor3, setFlavor3] = useState(ovl.flavors.Call);
// 	const [strikePrice3, setStrikePrice3] = useState(0);
// 	const [optionPrice3, setOptionPrice3] = useState(0);

// 	let callback3 = callback(setQty3, setFlavor3, setPosition3, setStrikePrice3, setOptionPrice3);

// 	const [qty4, setQty4] = useState(0);
// 	const [position4, setPosition4] = useState(ovl.positions.Long);
// 	const [flavor4, setFlavor4] = useState(ovl.flavors.Call);
// 	const [strikePrice4, setStrikePrice4] = useState(0);
// 	const [optionPrice4, setOptionPrice4] = useState(0);

// 	let callback4 = callback(setQty4, setFlavor4, setPosition4, setStrikePrice4, setOptionPrice4);

// 	let customSpread = [
// 		new Option(flavor1, position1, parseFloat(strikePrice1), parseFloat(optionPrice1)),
// 		new Option(flavor2, position2, parseFloat(strikePrice2), parseFloat(optionPrice2)),
// 		new Option(flavor3, position3, parseFloat(strikePrice3), parseFloat(optionPrice3)),
// 		new Option(flavor4, position4, parseFloat(strikePrice4), parseFloat(optionPrice4)),
// 	];
// 	let quantities = [qty1, qty2, qty3, qty4];
// 	let customPortfolioChartData = ovl.createChartData('Custom Spread', customSpread, quantities, spotPrices);

// 	return (
// 		<Container>
// 			<p></p>
// 			<h1>Options Visualizer</h1>
// 			<Row className='h-250'>
// 				<Col>
// 					<Line data={customPortfolioChartData} options={ovl.chartOptions('Custom Spread')} />
// 					<OVInput q={qty1} pos={position1} flav={flavor1} k={strikePrice1} op={optionPrice1} callback={callback1}></OVInput>
// 					<OVInput q={qty2} pos={position2} flav={flavor2} k={strikePrice2} op={optionPrice2} callback={callback2}></OVInput>
// 					<OVInput q={qty3} pos={position3} flav={flavor3} k={strikePrice3} op={optionPrice3} callback={callback3}></OVInput>
// 					<OVInput q={qty4} pos={position4} flav={flavor4} k={strikePrice4} op={optionPrice4} callback={callback4}></OVInput>
// 				</Col>
// 				<Form.Text muted>Note: Quantities greater than 10,000 cause significant slow-downs in graph rendering.</Form.Text>
// 			</Row>
// 		</Container>
// 	);
// }

// /*

// <Row>
// 						<Col>
// 							<Form.Label>Quantity</Form.Label>
// 							<InputGroup>
// 								<InputGroup.Text>#</InputGroup.Text>
// 								<Form.Control id='strikePrice' placeholder={qty1} onChange={(event) => setQty1(event.target.value)} />
// 							</InputGroup>
// 						</Col>
// 						<Col>
// 							<Form.Label>Position</Form.Label>
// 							<Form.Select placeholder={position1} onChange={(event) => setPosition1(event.target.value)}>
// 								<option>{ovl.positions.Long}</option>
// 								<option>{ovl.positions.Short}</option>
// 							</Form.Select>
// 						</Col>
// 						<Col>
// 							<Form.Label>Flavor</Form.Label>
// 							<Form.Select placeholder={flavor1} onChange={(event) => setFlavor1(event.target.value)}>
// 								<option>{ovl.flavors.Call}</option>
// 								<option>{ovl.flavors.Put}</option>
// 							</Form.Select>
// 						</Col>
// 						<Col>
// 							<Form.Label>Strike Price</Form.Label>
// 							<InputGroup>
// 								<InputGroup.Text>$</InputGroup.Text>
// 								<Form.Control id='strikePrice' placeholder={strikePrice1} onChange={(event) => setStrikePrice1(event.target.value)} />
// 							</InputGroup>
// 						</Col>
// 						<Col>
// 							<Form.Label>Option Price</Form.Label>
// 							<InputGroup>
// 								<InputGroup.Text>$</InputGroup.Text>
// 								<Form.Control id='optionPrice' placeholder={optionPrice1} onChange={(event) => setOptionPrice1(event.target.value)} />
// 							</InputGroup>
// 						</Col>
// 					</Row>
// 					<Row>
// 						<Col>
// 							<Form.Label>Quantity</Form.Label>
// 							<InputGroup>
// 								<InputGroup.Text>#</InputGroup.Text>
// 								<Form.Control id='strikePrice' placeholder={qty2} onChange={(event) => setQty2(event.target.value)} />
// 							</InputGroup>
// 						</Col>
// 						<Col>
// 							<Form.Label>Position</Form.Label>
// 							<Form.Select placeholder={position2} onChange={(event) => setPosition2(event.target.value)}>
// 								<option>{ovl.positions.Long}</option>
// 								<option>{ovl.positions.Short}</option>
// 							</Form.Select>
// 						</Col>
// 						<Col>
// 							<Form.Label>Flavor</Form.Label>
// 							<Form.Select placeholder={flavor2} onChange={(event) => setFlavor2(event.target.value)}>
// 								<option>{ovl.flavors.Call}</option>
// 								<option>{ovl.flavors.Put}</option>
// 							</Form.Select>
// 						</Col>
// 						<Col>
// 							<Form.Label>Strike Price</Form.Label>
// 							<InputGroup>
// 								<InputGroup.Text>$</InputGroup.Text>
// 								<Form.Control id='strikePrice' placeholder={strikePrice2} onChange={(event) => setStrikePrice2(event.target.value)} />
// 							</InputGroup>
// 						</Col>
// 						<Col>
// 							<Form.Label>Option Price</Form.Label>
// 							<InputGroup>
// 								<InputGroup.Text>$</InputGroup.Text>
// 								<Form.Control id='optionPrice' placeholder={optionPrice2} onChange={(event) => setOptionPrice2(event.target.value)} />
// 							</InputGroup>
// 						</Col>
// 					</Row>
// 					<Row>
// 						<Col>
// 							<Form.Label>Quantity</Form.Label>
// 							<InputGroup>
// 								<InputGroup.Text>#</InputGroup.Text>
// 								<Form.Control id='strikePrice' placeholder={qty3} onChange={(event) => setQty3(event.target.value)} />
// 							</InputGroup>
// 						</Col>
// 						<Col>
// 							<Form.Label>Position</Form.Label>
// 							<Form.Select placeholder={position3} onChange={(event) => setPosition3(event.target.value)}>
// 								<option>{ovl.positions.Long}</option>
// 								<option>{ovl.positions.Short}</option>
// 							</Form.Select>
// 						</Col>
// 						<Col>
// 							<Form.Label>Flavor</Form.Label>
// 							<Form.Select placeholder={flavor3} onChange={(event) => setFlavor3(event.target.value)}>
// 								<option>{ovl.flavors.Call}</option>
// 								<option>{ovl.flavors.Put}</option>
// 							</Form.Select>
// 						</Col>
// 						<Col>
// 							<Form.Label>Strike Price</Form.Label>
// 							<InputGroup>
// 								<InputGroup.Text>$</InputGroup.Text>
// 								<Form.Control id='strikePrice' placeholder={strikePrice3} onChange={(event) => setStrikePrice3(event.target.value)} />
// 							</InputGroup>
// 						</Col>
// 						<Col>
// 							<Form.Label>Option Price</Form.Label>
// 							<InputGroup>
// 								<InputGroup.Text>$</InputGroup.Text>
// 								<Form.Control id='optionPrice' placeholder={optionPrice3} onChange={(event) => setOptionPrice3(event.target.value)} />
// 							</InputGroup>
// 						</Col>
// 					</Row>
// 					<Row>
// 						<Col>
// 							<Form.Label>Quantity</Form.Label>
// 							<InputGroup>
// 								<InputGroup.Text>#</InputGroup.Text>
// 								<Form.Control id='strikePrice' placeholder={qty4} onChange={(event) => setQty4(event.target.value)} />
// 							</InputGroup>
// 						</Col>
// 						<Col>
// 							<Form.Label>Position</Form.Label>
// 							<Form.Select placeholder={position4} onChange={(event) => setPosition4(event.target.value)}>
// 								<option>{ovl.positions.Long}</option>
// 								<option>{ovl.positions.Short}</option>
// 							</Form.Select>
// 						</Col>
// 						<Col>
// 							<Form.Label>Flavor</Form.Label>
// 							<Form.Select placeholder={flavor4} onChange={(event) => setFlavor4(event.target.value)}>
// 								<option>{ovl.flavors.Call}</option>
// 								<option>{ovl.flavors.Put}</option>
// 							</Form.Select>
// 						</Col>
// 						<Col>
// 							<Form.Label>Strike Price</Form.Label>
// 							<InputGroup>
// 								<InputGroup.Text>$</InputGroup.Text>
// 								<Form.Control id='strikePrice' placeholder={strikePrice4} onChange={(event) => setStrikePrice4(event.target.value)} />
// 							</InputGroup>
// 						</Col>
// 						<Col>
// 							<Form.Label>Option Price</Form.Label>
// 							<InputGroup>
// 								<InputGroup.Text>$</InputGroup.Text>
// 								<Form.Control id='optionPrice' placeholder={optionPrice4} onChange={(event) => setOptionPrice4(event.target.value)} />
// 							</InputGroup>
// 						</Col>
// 					</Row>

// */
