import React from 'react';
import { Container, Row, Col, Form, InputGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { Chart, Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Filler } from 'chart.js';
import Option from '../logic/Option.js';
import * as ovl from '../logic/OptionVisLib.js';

ChartJS.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Filler);

export default function SpreadTypes() {
	let inc = 0;
	let portfolioPayoffDataArray = [];

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

	return (
		<Container>
			<h1>Naked Options</h1>
			{/* --------------------------------------------------------------------------- 				Static Options
			------------------------------------------------------------------------------- */}
			<Row className='h-250'>
				<Col>
					<Line data={portfolioPayoffDataArray[inc][1]} options={ovl.chartOptions(portfolioPayoffDataArray[inc++][0])}></Line>
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
					<Line data={portfolioPayoffDataArray[inc][1]} options={ovl.chartOptions(portfolioPayoffDataArray[inc++][0])}></Line>
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
					<Line data={portfolioPayoffDataArray[inc][1]} options={ovl.chartOptions(portfolioPayoffDataArray[inc++][0])}></Line>
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
					<Line data={portfolioPayoffDataArray[inc][1]} options={ovl.chartOptions(portfolioPayoffDataArray[inc++][0])}></Line>
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
					<Line data={portfolioPayoffDataArray[inc][1]} options={ovl.chartOptions(portfolioPayoffDataArray[inc++][0])}></Line>
				</Col>
				<Col>
					<Line data={portfolioPayoffDataArray[inc][1]} options={ovl.chartOptions(portfolioPayoffDataArray[inc++][0])}></Line>
				</Col>
			</Row>
			<Row className='h-250'>
				<Col>
					<Line data={portfolioPayoffDataArray[inc][1]} options={ovl.chartOptions(portfolioPayoffDataArray[inc++][0])}></Line>
				</Col>
				<Col>
					<Line data={portfolioPayoffDataArray[inc][1]} options={ovl.chartOptions(portfolioPayoffDataArray[inc++][0])}></Line>
				</Col>
			</Row>
			<Row className='h-250'>
				<Col>
					<Line data={portfolioPayoffDataArray[inc][1]} options={ovl.chartOptions(portfolioPayoffDataArray[inc++][0])}></Line>
				</Col>
				<Col>
					<Line data={portfolioPayoffDataArray[inc][1]} options={ovl.chartOptions(portfolioPayoffDataArray[inc++][0])}></Line>
				</Col>
			</Row>
			<Row className='h-250'>
				<Col>
					<Line data={portfolioPayoffDataArray[inc][1]} options={ovl.chartOptions(portfolioPayoffDataArray[inc++][0])}></Line>
				</Col>
				<Col>
					<Line data={portfolioPayoffDataArray[inc][1]} options={ovl.chartOptions(portfolioPayoffDataArray[inc++][0])}></Line>
				</Col>
			</Row>
			<Row className='h-250'>
				<Col>
					<Line data={portfolioPayoffDataArray[inc][1]} options={ovl.chartOptions(portfolioPayoffDataArray[inc++][0])}></Line>
				</Col>
				<Col>
					<Line data={portfolioPayoffDataArray[inc][1]} options={ovl.chartOptions(portfolioPayoffDataArray[inc++][0])}></Line>
				</Col>
			</Row>
			<Row className='h-250'>
				<Col>
					<Line data={portfolioPayoffDataArray[inc][1]} options={ovl.chartOptions(portfolioPayoffDataArray[inc++][0])}></Line>
				</Col>
				<Col></Col>
			</Row>
		</Container>
	);
}
