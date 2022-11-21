import React from 'react';
import { Col, Container, Row, Form, InputGroup } from 'react-bootstrap';
import { useState } from 'react';

export default function BinModel() {
	const [spotPrice, setSpotPrice] = useState(100);
	const [strikePrice, setStrikePrice] = useState(110);
	const [uParam, setuParam] = useState(1.2);
	const [dParam, setdParam] = useState(0.9);
	const [intRate, setIntRate] = useState(1.02);
	const [upStatePrice, setUpStatePrice] = useState(120);
	const [downStatePrice, setDownStatePrice] = useState(90);
	const [callUpStatePayoff, setCallUpStatePayoff] = useState(10);
	const [callDownStatePayoff, setCallDownStatePayoff] = useState(0);
	const [callDelta, setCallDelta] = useState();

	function calcStatePayoff(spot, strike, isCall) {
		let payoff = -1;
		if (isCall) {
			payoff = spot - strike;
		} else {
			payoff = strike - spot;
		}

		payoff = payoff > 0 ? payoff : 0;
		return payoff;
	}

	function calcDelta(upPayoff, downPayoff, upSpot, downSpot) {
		return (upPayoff - downPayoff) / (upSpot - downSpot);
	}

	function calcBParam(rate, u, d, upPayoff, downPayoff) {
		return ((1 / rate) * ((u * downPayoff) / (d * upPayoff))) / (u - d);
	}

	return (
		<Container>
			<h1>General Inputs</h1>
			<Row>
				<Col>
					<Form.Label>Spot Price</Form.Label>
					<InputGroup>
						<InputGroup.Text>$</InputGroup.Text>
						<Form.Control
							value={spotPrice}
							onChange={(event) => {
								let newVal = event.target.value;
								setSpotPrice(newVal);

								let newUpPrice = newVal * uParam;
								setUpStatePrice(newUpPrice);

								let newDownPrice = newVal * dParam;
								setDownStatePrice(newDownPrice);

								let newUpPayoff = calcStatePayoff(newUpPrice, strikePrice, true);
								setCallUpStatePayoff(newUpPayoff);

								let newDownPayoff = calcStatePayoff(newDownPrice, strikePrice, true);
								setCallDownStatePayoff(newDownPayoff);

								setCallDelta(calcDelta(newUpPayoff, newDownPayoff, newUpPrice, newDownPrice));
							}}
						/>
					</InputGroup>
				</Col>
				<Col>
					<Form.Label>Strike Price</Form.Label>
					<InputGroup>
						<InputGroup.Text>$</InputGroup.Text>
						<Form.Control
							value={strikePrice}
							onChange={(event) => {
								setStrikePrice(event.target.value);
								setCallUpStatePayoff(calcStatePayoff(upStatePrice, event.target.value, true));
								setCallDownStatePayoff(calcStatePayoff(downStatePrice, event.target.value, true));
							}}
						/>
					</InputGroup>
				</Col>
				<Col>
					<Form.Label>u-Parameter</Form.Label>
					<InputGroup>
						<Form.Control
							value={uParam}
							onChange={(event) => {
								setuParam(event.target.value);
								setUpStatePrice(event.target.value * spotPrice);
								setCallUpStatePayoff(calcStatePayoff(event.target.value * spotPrice, strikePrice, true));
							}}
						/>
					</InputGroup>
				</Col>
				<Col>
					<Form.Label>d-Parameter</Form.Label>
					<InputGroup>
						<Form.Control
							value={dParam}
							onChange={(event) => {
								setdParam(event.target.value);
								setDownStatePrice(event.target.value * spotPrice);
								setCallDownStatePayoff(calcStatePayoff(event.target.value * spotPrice, strikePrice, true));
							}}
						/>
					</InputGroup>
				</Col>
				<Col>
					<Form.Label>Gross Interest Rate</Form.Label>
					<InputGroup>
						<Form.Control value={intRate} onChange={(event) => setIntRate(event.target.value)} />
					</InputGroup>
				</Col>
			</Row>
			<Row>
				{/* <h2>Replication Portfolio Inputs</h2> */}
				<Col>
					<Form.Label>Up State Price</Form.Label>
					<InputGroup>
						<InputGroup.Text>$</InputGroup.Text>
						<Form.Control
							value={upStatePrice}
							onChange={(event) => {
								let newVal = event.target.value;
								setUpStatePrice(newVal);
								setuParam(newVal / spotPrice);
								let upStatePayoff = calcStatePayoff(newVal, strikePrice, true);
								setCallUpStatePayoff(upStatePayoff);
								setCallDelta(calcDelta(upStatePayoff, callDownStatePayoff, newVal, downStatePrice));
							}}
						/>
					</InputGroup>
				</Col>
				<Col>
					<Form.Label>Down State Price</Form.Label>
					<InputGroup>
						<InputGroup.Text>$</InputGroup.Text>
						<Form.Control
							value={downStatePrice}
							onChange={(event) => {
								let newVal = event.target.value;
								setDownStatePrice(newVal);
								setdParam(newVal / spotPrice);
								let downStatePayoff = calcStatePayoff(newVal, strikePrice, true);
								setCallDownStatePayoff(downStatePayoff);
								setCallDelta(calcDelta(callUpStatePayoff, downStatePayoff, upStatePrice, newVal));
							}}
						/>
					</InputGroup>
				</Col>
			</Row>
			<Row>
				<Col>
					{/* CALL */}
					<h2>Call</h2>
					<Row>
						<Col>
							<Form.Label>Up State Payoff (Gross)</Form.Label>
							<InputGroup>
								<InputGroup.Text>$</InputGroup.Text>
								<Form.Control
									value={callUpStatePayoff}
									onChange={(event) => {
										setCallUpStatePayoff(event.target.value);
									}}
								/>
							</InputGroup>
						</Col>
						<Col>
							<Form.Label>Down State Payoff (Gross)</Form.Label>
							<InputGroup>
								<InputGroup.Text>$</InputGroup.Text>
								<Form.Control
									value={callDownStatePayoff}
									onChange={(event) => {
										setCallDownStatePayoff(event.target.value);
										// setuParam(event.target.value / spotPrice);
									}}
								/>
							</InputGroup>
						</Col>
					</Row>
					<Row>
						<Col>
							<Form.Label>Delta</Form.Label>
							<InputGroup>
								<Form.Control value={callDelta} />
							</InputGroup>
						</Col>
						<Col>
							<Form.Label>B-Parameter</Form.Label>
							<InputGroup>
								<Form.Control />
							</InputGroup>
						</Col>
					</Row>
					<Col>
						<Form.Label>Call Price</Form.Label>
						<InputGroup>
							<Form.Control />
						</InputGroup>
					</Col>
				</Col>
				<Col>
					{/* CALL */}
					<h2>Put</h2>
					<Row>
						<Col>
							<Form.Label>Up State Payoff</Form.Label>
							<InputGroup>
								<InputGroup.Text>$</InputGroup.Text>
								<Form.Control />
							</InputGroup>
						</Col>
						<Col>
							<Form.Label>Down State Payoff</Form.Label>
							<InputGroup>
								<InputGroup.Text>$</InputGroup.Text>
								<Form.Control />
							</InputGroup>
						</Col>
					</Row>
					<Row>
						<Col>
							<Form.Label>Delta</Form.Label>
							<InputGroup>
								<Form.Control />
							</InputGroup>
						</Col>
						<Col>
							<Form.Label>B-Parameter</Form.Label>
							<InputGroup>
								<Form.Control />
							</InputGroup>
						</Col>
					</Row>
					<Col>
						<Form.Label>Put Price</Form.Label>
						<InputGroup>
							<Form.Control />
						</InputGroup>
					</Col>
				</Col>
			</Row>
		</Container>
	);
}