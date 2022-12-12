import React from 'react';
import { Col, Container, Row, Form, InputGroup, Button, ButtonGroup } from 'react-bootstrap';
import { useState } from 'react';
import { calcImpliedVol } from '../logic/ImpliedVolatility';
var { jStat } = require('jstat');

export default function BlackScholes() {
	const [S, setS] = useState(100);
	const [K, setK] = useState(110);
	const [sigma, setSigma] = useState(20);
	const [T, setT] = useState(1);
	const [R, setR] = useState(2);
	const [DY, setDY] = useState(0);

	const [d1, setd1] = useState(0);
	const [d2, setd2] = useState(0);
	const [Nd1, setNd1] = useState(0);
	const [Nd2, setNd2] = useState(0);
	const [negNd1, setNegNd1] = useState(0);
	const [negNd2, setNegNd2] = useState(0);
	const [pvK, setpvK] = useState(0);
	const [driftTerm, setDriftTerm] = useState(0);
	const [callPrice, setCallPrice] = useState(0);
	const [putPrice, setPutPrice] = useState(0);

	const modes = {
		prices: 'Prices',
		ivC: 'IV - Call',
		ivP: 'IV - Put',
	};

	const [mode, setMode] = useState(modes.prices);

	const timeUnits = {
		years: 'Years',
		months: 'Months -> Years',
		weeks: 'Weeks -> Years',
		days365: 'Days (365 days / year) -> Years',
		days252: 'Days (252 days / year) -> Years',
	};
	const [timeUnit, setTimeUnit] = useState(timeUnits.years);

	function NORMDIST(x, mean, sd, cumulative) {
		return cumulative ? jStat.normal.cdf(x, mean, sd) : jStat.normal.pdf(x, mean, sd);
	}

	function calcPrices() {
		let r = R / 100;
		let sig = sigma / 100;
		let dy = DY / 100;
		let d1 = (1 / (sig * Math.sqrt(T))) * (Math.log(S / K) + (r - dy + 0.5 * sig ** 2) * T);
		let d2 = d1 - sig * Math.sqrt(T);
		let pvK = K * Math.E ** (-r * T);
		let Nd1 = NORMDIST(d1, 0, 1, true);
		let Nd2 = NORMDIST(d2, 0, 1, true);
		let negNd1 = 1 - Nd1;
		let negNd2 = 1 - Nd2;

		setDriftTerm((r - dy + 0.5 * sig ** 2) * T); // ! idk what drift term should really be, is T included or no?

		setd1(d1);
		setd2(d2);
		setNd1(Nd1);
		setNd2(Nd2);
		setpvK(pvK);
		setNegNd1(negNd1);
		setNegNd2(negNd2);

		let c = S * Math.E ** (-dy * T) * Nd1 - pvK * Nd2;
		let p = pvK * negNd2 - S * Math.E ** (-dy * T) * negNd1;

		setCallPrice(c);
		setPutPrice(p);
	}

	function handle() {
		let r = R / 100;
		let sig = sigma / 100;
		let dy = DY / 100;
		if (mode === modes.prices) {
			calcPrices();
		} else if (mode === modes.ivC) {
			setSigma(calcImpliedVol(callPrice, S, K, r, dy, T, true) * 100);
		} else if (mode === modes.ivP) {
			setSigma(calcImpliedVol(putPrice, S, K, r, dy, T, false) * 100);
		}
	}

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
			<ButtonGroup>
				<Button variant={mode === modes.prices ? 'danger' : 'secondary'} onClick={() => setMode(modes.prices)}>
					{modes.prices}
				</Button>
				<Button variant={mode === modes.ivC ? 'danger' : 'secondary'} onClick={() => setMode(modes.ivC)}>
					{modes.ivC}
				</Button>
				<Button variant={mode === modes.ivP ? 'danger' : 'secondary'} onClick={() => setMode(modes.ivP)}>
					{modes.ivP}
				</Button>
			</ButtonGroup>
			<p></p>
			<h1>Black-Scholes Model</h1>
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
					<Form.Label>{mode ? 'Sigma / Volatility' : 'Implied Volatility'}</Form.Label>
					<InputGroup>
						<Form.Control
							disabled={mode !== modes.prices}
							value={sigma}
							onChange={(event) => {
								let newVal = event.target.value;
								setSigma(newVal);
							}}
						/>
						<InputGroup.Text>%</InputGroup.Text>
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
					<Form.Label>d1</Form.Label>
					<InputGroup>
						<Form.Control disabled value={d1} />
					</InputGroup>
				</Col>
				<Col>
					<Form.Label>d2</Form.Label>
					<InputGroup>
						<Form.Control disabled value={d2} />
					</InputGroup>
				</Col>
			</Row>
			<p></p>
			<Row>
				<Col>
					<Form.Label>N(d1)</Form.Label>
					<InputGroup>
						<Form.Control disabled value={Nd1} />
					</InputGroup>
				</Col>
				<Col>
					<Form.Label>N(d2)</Form.Label>
					<InputGroup>
						<Form.Control disabled value={Nd2} />
					</InputGroup>
				</Col>
				<Col>
					<Form.Label>N(-d1)</Form.Label>
					<InputGroup>
						<Form.Control disabled value={negNd1} />
					</InputGroup>
				</Col>
				<Col>
					<Form.Label>N(-d2)</Form.Label>
					<InputGroup>
						<Form.Control disabled value={negNd2} />
					</InputGroup>
				</Col>
			</Row>
			<p></p>
			<Row>
				<Col>
					<Form.Label>PV(K)</Form.Label>
					<InputGroup>
						<Form.Control disabled value={pvK} />
					</InputGroup>
				</Col>
				<Col>
					<Form.Label>Drift Term</Form.Label>
					<InputGroup>
						<Form.Control disabled value={driftTerm} />
					</InputGroup>
				</Col>
			</Row>
			<p></p>
			<Row>
				<Col>
					<Form.Label>Call Price</Form.Label>
					<InputGroup>
						<Form.Control
							disabled={mode !== modes.ivC}
							value={callPrice}
							onChange={(event) => {
								setCallPrice(event.target.value);
							}}
						/>
					</InputGroup>
				</Col>
				<Col>
					<Form.Label>Put Price</Form.Label>
					<InputGroup>
						<Form.Control
							disabled={mode !== modes.ivP}
							value={putPrice}
							onChange={(event) => {
								setPutPrice(event.target.value);
							}}
						/>
					</InputGroup>
				</Col>
			</Row>
		</Container>
	);
}
