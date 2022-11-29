import React from 'react';
import { Col, Container, Row, Form, InputGroup, Button } from 'react-bootstrap';
import { useState } from 'react';
var { jStat } = require('jstat');

export default function BlackScholes() {
	const [S, setS] = useState(100);
	const [K, setK] = useState(110);
	const [sigma, setSigma] = useState(20);
	const [T, setT] = useState(3 / 12);
	const [R, setR] = useState(2);
	const [callPrice, setCallPrice] = useState(3.921568627450981);
	const [putPrice, setPutPrice] = useState(11.764705882352937);

	let d1 = 0;
	let d2 = 0;
	let Nd1 = 0;
	let Nd2 = 0;
	let negNd1 = 0;
	let negNd2 = 0;
	let pvK = 0;

	function NORMDIST(x, mean, sd, cumulative) {
		return cumulative ? jStat.normal.cdf(x, mean, sd) : jStat.normal.pdf(x, mean, sd);
	}

	function doCalcs() {
		let r = R / 100;
		let sig = sigma / 100;
		d1 = (1 / (sig * Math.sqrt(T))) * (Math.log(S / K) + (r + 0.5 * sig ** 2) * T);
		d2 = d1 - sig * Math.sqrt(T);
		pvK = K * Math.E ** (-r * T);
		Nd1 = NORMDIST(d1, 0, 1, true);
		Nd2 = NORMDIST(d2, 0, 1, true);
		negNd1 = 1 - Nd1;
		negNd2 = 1 - Nd2;

		setCallPrice(S * Nd1 - pvK * Nd2);
		setPutPrice(pvK * negNd2 - S * negNd1);
	}

	return (
		<Container>
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
					<Form.Label>Sigma / Volitility</Form.Label>
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
					<Form.Label>Time</Form.Label>
					<InputGroup>
						<Form.Control
							value={T}
							onChange={(event) => {
								let newVal = event.target.value;
								setT(newVal);
							}}
						/>
						<InputGroup.Text>years</InputGroup.Text>
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
							doCalcs();
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
					<Form.Label>Call Price</Form.Label>
					<InputGroup>
						<Form.Control disabled value={callPrice} />
					</InputGroup>
				</Col>
				<Col>
					<Form.Label>Put Price</Form.Label>
					<InputGroup>
						<Form.Control disabled value={putPrice} />
					</InputGroup>
				</Col>
			</Row>
		</Container>
	);
}
