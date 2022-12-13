import React from 'react';
import { Col, Container, Row, Form, InputGroup, Button, ButtonGroup } from 'react-bootstrap';
import { useState } from 'react';
import * as bsl from '../logic/BlackScholesLib.js';

export default function BlackScholesIV() {
	const [S, setS] = useState(100);
	const [K, setK] = useState(110);
	const [T, setT] = useState(1);
	const [R, setR] = useState(2);
	const [DY, setDY] = useState(0);
	const [callPrice, setCallPrice] = useState(4.94);
	const [putPrice, setPutPrice] = useState(12.77);

	const [sigma, setSigma] = useState(0);

	const modes = {
		ivC: 'IV - Call',
		ivP: 'IV - Put',
	};

	const [mode, setMode] = useState(modes.ivC);

	// todo move to a centra lib
	const timeUnits = {
		years: 'Years',
		months: 'Months -> Years',
		weeks: 'Weeks -> Years',
		days365: 'Days (365 days / year) -> Years',
		days252: 'Days (252 days / year) -> Years',
	};
	const [timeUnit, setTimeUnit] = useState(timeUnits.years);

	function handle() {
		let r = R / 100;
		let dy = DY / 100;

		if (mode === modes.ivC) {
			setSigma(bsl.calcImpliedVol(callPrice, S, K, r, dy, T, true) * 100);
		} else if (mode === modes.ivP) {
			setSigma(bsl.calcImpliedVol(putPrice, S, K, r, dy, T, false) * 100);
		}
	}

	// todo move to a centra lib
	function handleTimeUnitChange(e) {
		let denominator = 0;
		switch (e) {
			case timeUnits.years:
				denominator = 1;
				break;
			case timeUnits.months:
				denominator = 12;
				break;
			case timeUnits.weeks:
				denominator = 52;
				break;
			case timeUnits.days365:
				denominator = 365;
				break;
			case timeUnits.days252:
				denominator = 252;
				break;
			default:
				denominator = -1;
		}
		setT(parseFloat(T) / denominator);
		setTimeUnit(timeUnits.years);
	}

	return (
		<Container>
			<h1>BSM: Implied Volatility</h1>
			<p></p>
			<h2>Inputs</h2>
			<Row>
				<Col>
					<Form.Label>Spot Price</Form.Label>
					<InputGroup>
						<InputGroup.Text>$</InputGroup.Text>
						<Form.Control
							value={S}
							onChange={(event) => {
								setS(event.target.value);
							}}
						/>
					</InputGroup>
				</Col>

				<Col>
					<Form.Label>{mode === modes.ivC ? 'Call Price' : 'Put Price'}</Form.Label>
					<InputGroup>
						<InputGroup.Text>$</InputGroup.Text>
						{mode === modes.ivC ? (
							<Form.Control
								value={callPrice}
								onChange={(event) => {
									setCallPrice(event.target.value);
								}}
							/>
						) : (
							<Form.Control
								value={putPrice}
								onChange={(event) => {
									setPutPrice(event.target.value);
								}}
							/>
						)}
						<ButtonGroup>
							<Button variant={mode === modes.ivC ? 'danger' : 'secondary'} onClick={() => setMode(modes.ivC)}>
								{modes.ivC}
							</Button>
							<Button variant={mode === modes.ivP ? 'danger' : 'secondary'} onClick={() => setMode(modes.ivP)}>
								{modes.ivP}
							</Button>
						</ButtonGroup>
					</InputGroup>
				</Col>
				<Col>
					<Form.Label>Dividend Yield</Form.Label>
					<InputGroup>
						<Form.Control
							value={DY}
							onChange={(event) => {
								let newVal = event.target.value;
								setDY(newVal);
							}}
						/>
						<InputGroup.Text>%</InputGroup.Text>
					</InputGroup>
				</Col>
			</Row>
			<p></p>
			<Row>
				<Col>
					<Form.Label>Strike Price</Form.Label>
					<InputGroup>
						<InputGroup.Text>$</InputGroup.Text>
						<Form.Control
							value={K}
							onChange={(event) => {
								setK(event.target.value);
							}}
						/>
					</InputGroup>
				</Col>
				<Col>
					<Form.Label>Time</Form.Label>
					<InputGroup>
						<Form.Control
							value={T}
							onChange={(event) => {
								let newVal = event.target.value;
								setT(newVal);
							}}
						/>
						<Form.Select style={{ backgroundColor: '#eaecef' }} value={timeUnit} onChange={(event) => handleTimeUnitChange(event.target.value)}>
							<option>{timeUnits.years}</option>
							<option>{timeUnits.months}</option>
							<option>{timeUnits.weeks}</option>
							<option>{timeUnits.days365}</option>
							<option>{timeUnits.days252}</option>
						</Form.Select>
					</InputGroup>
				</Col>
				<Col>
					<Form.Label>Interest Rate</Form.Label>
					<InputGroup>
						<Form.Control
							value={R}
							onChange={(event) => {
								let newVal = event.target.value;
								setR(newVal);
							}}
						/>
						<InputGroup.Text>%</InputGroup.Text>
					</InputGroup>
				</Col>
			</Row>
			<p></p>
			<Row>
				<Col>
					<Button
						variant='danger'
						onClick={() => {
							handle();
						}}
					>
						Calculate Model
					</Button>
				</Col>
			</Row>
			<p></p>
			<h2>Outputs</h2>
			<Row>
				<Col>
					<Form.Label>Implied Volatility</Form.Label>
					<InputGroup>
						<Form.Control
							disabled
							value={sigma}
							onChange={(event) => {
								let newVal = event.target.value;
								setSigma(newVal);
							}}
						/>
						<InputGroup.Text>%</InputGroup.Text>
					</InputGroup>
				</Col>
				<Col></Col>
				<Col></Col>
			</Row>
		</Container>
	);
}
