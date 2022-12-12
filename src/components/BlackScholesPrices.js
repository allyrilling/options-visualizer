import React from 'react';
import { Col, Container, Row, Form, InputGroup, Button } from 'react-bootstrap';
import { useState } from 'react';
import * as bsl from '../logic/BlackScholesLib';

export default function BlackScholesPrices() {
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
	const [pvS, setpvS] = useState(0);
	const [driftTerm, setDriftTerm] = useState(0);
	const [callPrice, setCallPrice] = useState(0);
	const [putPrice, setPutPrice] = useState(0);

	const timeUnits = {
		years: 'Years',
		months: 'Months -> Years',
		weeks: 'Weeks -> Years',
		days365: 'Days (365 days / year) -> Years',
		days252: 'Days (252 days / year) -> Years',
	};
	const [timeUnit, setTimeUnit] = useState(timeUnits.years);

	function handleCalcModel() {
		let r = R / 100;
		let sig = sigma / 100;
		let dy = DY / 100;

		let ds = bsl.calcDs(S, K, sig, dy, r, T);

		setd1(ds[0]);
		setd2(ds[1]);
		setNd1(ds[2]);
		setNd2(ds[3]);
		setNegNd1(ds[4]);
		setNegNd2(ds[5]);

		setpvK(bsl.calcPVK(K, r, T));
		setpvS(bsl.calcPVS(S, dy, T));
		setDriftTerm(bsl.calcDriftTerm(sig, r, dy, T));

		setCallPrice(bsl.calcBSPrice(S, K, sig, dy, r, T, true));
		setPutPrice(bsl.calcBSPrice(S, K, sig, dy, r, T, false));
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
			<h1>BSM: Option Prices</h1>
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
					<Form.Label>Sigma / Volatility</Form.Label>
					<InputGroup>
						<Form.Control
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
							handleCalcModel();
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
					<Form.Label>PV(S)</Form.Label>
					<InputGroup>
						<Form.Control disabled value={pvS} />
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
						<InputGroup.Text>$</InputGroup.Text>
						<Form.Control disabled value={callPrice} />
					</InputGroup>
				</Col>
				<Col>
					<Form.Label>Put Price</Form.Label>
					<InputGroup>
						<InputGroup.Text>$</InputGroup.Text>
						<Form.Control disabled value={putPrice} />
					</InputGroup>
				</Col>
			</Row>
		</Container>
	);
}
