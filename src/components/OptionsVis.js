import '../css/App.css';
import { Container, Row, Col, Form, InputGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { Chart, Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Filler } from 'chart.js';
import Option from '../logic/Option.js';
import * as ovl from '../logic/OptionVisLib.js';

ChartJS.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Filler);

export default function CreateChart() {
	let inc = 0;

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

	// x vals
	let spotPrices = (options) => {
		let list = [];
		let inc = 1;
		let highestStrike = ovl.determineHighestStrike(options);
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

	let portfolioPayoffDataArray = [];

	//-------------------------------------------------------------------------------
	// PUT CALL STATE CODE
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
		'Long Call': [new Option(ovl.flavors.Call, ovl.positions.Long, parseFloat(strikePrice_LC), parseFloat(optionPrice_LC))],
		'Long Put': [new Option(ovl.flavors.Put, ovl.positions.Long, parseFloat(strikePrice_LP), parseFloat(optionPrice_LP))],
		'Short Call': [new Option(ovl.flavors.Call, ovl.positions.Short, parseFloat(strikePrice_SC), parseFloat(optionPrice_SC))],
		'Short Put': [new Option(ovl.flavors.Put, ovl.positions.Short, parseFloat(strikePrice_SP), parseFloat(optionPrice_SP))],
		'Bull Spread': [new Option(ovl.flavors.Call, ovl.positions.Long, 90, 5), new Option(ovl.flavors.Call, ovl.positions.Short, 110, 2)],
		'Bear Spread': [new Option(ovl.flavors.Put, ovl.positions.Long, 110, 5), new Option(ovl.flavors.Put, ovl.positions.Short, 90, 2)],
		'Butterfly Spread': [
			new Option(ovl.flavors.Call, ovl.positions.Long, 80, 10),
			new Option(ovl.flavors.Call, ovl.positions.Short, 100, 5),
			new Option(ovl.flavors.Call, ovl.positions.Short, 100, 5),
			new Option(ovl.flavors.Call, ovl.positions.Long, 120, 2),
		],
		'Ratio Spread': [
			new Option(ovl.flavors.Call, ovl.positions.Long, 100, 10),
			new Option(ovl.flavors.Call, ovl.positions.Short, 150, 1),
			new Option(ovl.flavors.Call, ovl.positions.Short, 150, 1),
			new Option(ovl.flavors.Call, ovl.positions.Short, 150, 1),
			new Option(ovl.flavors.Call, ovl.positions.Short, 150, 1),
			new Option(ovl.flavors.Call, ovl.positions.Short, 150, 1),
			new Option(ovl.flavors.Call, ovl.positions.Short, 150, 1),
			new Option(ovl.flavors.Call, ovl.positions.Short, 150, 1),
			new Option(ovl.flavors.Call, ovl.positions.Short, 150, 1),
			new Option(ovl.flavors.Call, ovl.positions.Short, 150, 1),
			new Option(ovl.flavors.Call, ovl.positions.Short, 150, 1),
		],
		Straddle: [new Option(ovl.flavors.Put, ovl.positions.Long, 100, 10), new Option(ovl.flavors.Call, ovl.positions.Long, 100, 10)],
		Strangle: [new Option(ovl.flavors.Put, ovl.positions.Long, 90, 10), new Option(ovl.flavors.Call, ovl.positions.Long, 110, 10)],
		Strip: [
			new Option(ovl.flavors.Call, ovl.positions.Long, 100, 20),
			new Option(ovl.flavors.Put, ovl.positions.Long, 100, 20),
			new Option(ovl.flavors.Put, ovl.positions.Long, 100, 20),
		],
		Strap: [
			new Option(ovl.flavors.Put, ovl.positions.Long, 100, 20),
			new Option(ovl.flavors.Call, ovl.positions.Long, 100, 20),
			new Option(ovl.flavors.Call, ovl.positions.Long, 100, 20),
		],
		'Synthetic Long Forward': [new Option(ovl.flavors.Put, ovl.positions.Short, 100, 5), new Option(ovl.flavors.Call, ovl.positions.Long, 100, 5)],
		'Synthetic Short Forward': [new Option(ovl.flavors.Put, ovl.positions.Long, 100, 5), new Option(ovl.flavors.Call, ovl.positions.Short, 100, 5)],
		'Box Spread': [
			new Option(ovl.flavors.Put, ovl.positions.Long, 120, 5),
			new Option(ovl.flavors.Call, ovl.positions.Short, 120, 5),
			new Option(ovl.flavors.Put, ovl.positions.Short, 100, 5),
			new Option(ovl.flavors.Call, ovl.positions.Long, 100, 5),
		],
	};

	Object.entries(spreads).forEach(([key, value]) => {
		portfolioPayoffDataArray.push([key, ovl.createChartData(key, value, spotPrices)]);
	});

	//-------------------------------------------------------------------------------
	// CUSTOM SPREAD STATE CODE
	//-------------------------------------------------------------------------------

	const [qty1, setQty1] = useState(1);
	const [position1, setPosition1] = useState(ovl.positions.Long);
	const [flavor1, setFlavor1] = useState(ovl.flavors.Call);
	const [strikePrice1, setStrikePrice1] = useState(100);
	const [optionPrice1, setOptionPrice1] = useState(10);

	const [qty2, setQty2] = useState(0);
	const [position2, setPosition2] = useState(ovl.positions.Long);
	const [flavor2, setFlavor2] = useState(ovl.flavors.Call);
	const [strikePrice2, setStrikePrice2] = useState(0);
	const [optionPrice2, setOptionPrice2] = useState(0);

	const [qty3, setQty3] = useState(0);
	const [position3, setPosition3] = useState(ovl.positions.Long);
	const [flavor3, setFlavor3] = useState(ovl.flavors.Call);
	const [strikePrice3, setStrikePrice3] = useState(0);
	const [optionPrice3, setOptionPrice3] = useState(0);

	const [qty4, setQty4] = useState(0);
	const [position4, setPosition4] = useState(ovl.positions.Long);
	const [flavor4, setFlavor4] = useState(ovl.flavors.Call);
	const [strikePrice4, setStrikePrice4] = useState(0);
	const [optionPrice4, setOptionPrice4] = useState(0);

	let customSpread = [
		new Option(flavor1, position1, parseFloat(strikePrice1), parseFloat(optionPrice1)),
		new Option(flavor2, position2, parseFloat(strikePrice2), parseFloat(optionPrice2)),
		new Option(flavor3, position3, parseFloat(strikePrice3), parseFloat(optionPrice3)),
		new Option(flavor4, position4, parseFloat(strikePrice4), parseFloat(optionPrice4)),
	];
	let quantities = [qty1, qty2, qty3, qty4];
	let customPortfolioChartData = ovl.createChartData('Custom Spread', customSpread, quantities, spotPrices);

	return (
		<Container>
			<p></p>
			<h1>Options Visualizer</h1>
			{/* --------------------------------------------------------------------------- 				Custom Spread
			------------------------------------------------------------------------------- */}
			<Row className='h-250'>
				<Col>
					{/* <div>
						<canvas id='acquisitions'></canvas>
					</div>
					<script type='module' src='./acquisitions.js'></script> */}
				</Col>
			</Row>

			<Row className='h-250'>
				<Col>
					{/* <canvas id='acquisitions'></canvas>
					{(function () {
						let ctx = document.getElementById('acquisitions');
						if (ctx && newChartChanges) {
							new Chart(ctx, {
								type: 'line',
								options: chartOptions('Custom Spread'),
								data: customPortfolioChartData,
							});
							setNewChartChanges(false);
						}
					})()} */}
					{/* <Line data={customPortfolioChartData} options={chartOptions} /> */}
					<Line data={customPortfolioChartData} options={chartOptions('Custom Spread')} />
					<Row>
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
								<option>{ovl.positions.Long}</option>
								<option>{ovl.positions.Short}</option>
							</Form.Select>
						</Col>
						<Col>
							<Form.Label>Flavor</Form.Label>
							<Form.Select placeholder={flavor1} onChange={(event) => setFlavor1(event.target.value)}>
								<option>{ovl.flavors.Call}</option>
								<option>{ovl.flavors.Put}</option>
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
								<option>{ovl.positions.Long}</option>
								<option>{ovl.positions.Short}</option>
							</Form.Select>
						</Col>
						<Col>
							<Form.Label>Flavor</Form.Label>
							<Form.Select placeholder={flavor2} onChange={(event) => setFlavor2(event.target.value)}>
								<option>{ovl.flavors.Call}</option>
								<option>{ovl.flavors.Put}</option>
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
								<option>{ovl.positions.Long}</option>
								<option>{ovl.positions.Short}</option>
							</Form.Select>
						</Col>
						<Col>
							<Form.Label>Flavor</Form.Label>
							<Form.Select placeholder={flavor3} onChange={(event) => setFlavor3(event.target.value)}>
								<option>{ovl.flavors.Call}</option>
								<option>{ovl.flavors.Put}</option>
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
								<option>{ovl.positions.Long}</option>
								<option>{ovl.positions.Short}</option>
							</Form.Select>
						</Col>
						<Col>
							<Form.Label>Flavor</Form.Label>
							<Form.Select placeholder={flavor4} onChange={(event) => setFlavor4(event.target.value)}>
								<option>{ovl.flavors.Call}</option>
								<option>{ovl.flavors.Put}</option>
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
				<Form.Text muted>Note: Quantities greater than 10,000 cause significant slow-downs in graph rendering.</Form.Text>
			</Row>
		</Container>
	);
}
