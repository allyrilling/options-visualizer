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
	const [callDelta, setCallDelta] = useState(0.3333333333333333);
	const [callBParam, setCallBParam] = useState(-29.411764705882355);
	const [callPrice, setCallPrice] = useState(3.9215686274509736);

	const [putUpStatePayoff, setPutUpStatePayoff] = useState(0);
	const [putDownStatePayoff, setPutDownStatePayoff] = useState(20);
	const [putDelta, setPutDelta] = useState(-0.6666666666666666);
	const [putBParam, setPutBParam] = useState(78.43137254901961);
	const [putPrice, setPutPrice] = useState(11.764705882352956);

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
		return ((1 / rate) * (u * downPayoff - d * upPayoff)) / (u - d);
	}

	function calcOptionPrice(spot, delta, b) {
		return spot * delta + b;
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

								// CALL

								let newCallUpPayoff = calcStatePayoff(newUpPrice, strikePrice, true);
								setCallUpStatePayoff(newCallUpPayoff);

								let newCallDownPayoff = calcStatePayoff(newDownPrice, strikePrice, true);
								setCallDownStatePayoff(newCallDownPayoff);

								let newCallDelta = calcDelta(newCallUpPayoff, newCallDownPayoff, newUpPrice, newDownPrice);
								setCallDelta(newCallDelta);

								let newCallB = calcBParam(intRate, uParam, dParam, newCallUpPayoff, newCallDownPayoff);
								setCallBParam(newCallB);

								// PUT

								let newPutUpPayoff = calcStatePayoff(newUpPrice, strikePrice, false);
								setPutUpStatePayoff(newPutUpPayoff);

								let newPutDownPayoff = calcStatePayoff(newDownPrice, strikePrice, false);
								setPutDownStatePayoff(newPutDownPayoff);

								let newPutDelta = calcDelta(newPutUpPayoff, newPutDownPayoff, newUpPrice, newDownPrice);
								setPutDelta(newPutDelta);

								let newPutB = calcBParam(intRate, uParam, dParam, newPutUpPayoff, newPutDownPayoff);
								setPutBParam(newPutB);

								setPutPrice(calcOptionPrice(newVal, newPutDelta, newPutB));
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
								let newVal = event.target.value;
								setStrikePrice(newVal);

								// CALL

								let newCallUpPayoff = calcStatePayoff(upStatePrice, newVal, true);
								setCallUpStatePayoff(newCallUpPayoff);

								let newCallDownPayoff = calcStatePayoff(downStatePrice, newVal, true);
								setCallDownStatePayoff(newCallDownPayoff);

								let newCallDelta = calcDelta(newCallUpPayoff, newCallDownPayoff, upStatePrice, downStatePrice);
								setCallDelta(newCallDelta);

								let newCallB = calcBParam(intRate, uParam, dParam, newCallUpPayoff, newCallDownPayoff);
								setCallBParam(newCallB);

								setCallPrice(calcOptionPrice(spotPrice, newCallDelta, newCallB));

								// PUT

								let newPutUpPayoff = calcStatePayoff(upStatePrice, newVal, false);
								setPutUpStatePayoff(newPutUpPayoff);

								let newPutDownPayoff = calcStatePayoff(downStatePrice, newVal, false);
								setPutDownStatePayoff(newPutDownPayoff);

								let newPutDelta = calcDelta(newPutUpPayoff, newPutDownPayoff, upStatePrice, downStatePrice);
								setPutDelta(newPutDelta);

								let newPutB = calcBParam(intRate, uParam, dParam, newPutUpPayoff, newPutDownPayoff);
								setPutBParam(newPutB);

								setPutPrice(calcOptionPrice(spotPrice, newPutDelta, newPutB));
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
								let newVal = event.target.value;
								setuParam(newVal);

								let newUpPrice = spotPrice * newVal;
								setUpStatePrice(newUpPrice);

								// CALL

								let newCallUpPayoff = calcStatePayoff(newUpPrice, strikePrice, true);
								setCallUpStatePayoff(newCallUpPayoff);

								let newCallDelta = calcDelta(newCallUpPayoff, callDownStatePayoff, newUpPrice, downStatePrice);
								setCallDelta(newCallDelta);

								let newCallB = calcBParam(intRate, newVal, dParam, newCallUpPayoff, callDownStatePayoff);
								setCallBParam(newCallB);

								setCallPrice(calcOptionPrice(spotPrice, newCallDelta, newCallB));

								// PUT

								let newPutUpPayoff = calcStatePayoff(newUpPrice, strikePrice, false);
								setPutUpStatePayoff(newPutUpPayoff);

								let newPutDelta = calcDelta(newPutUpPayoff, putDownStatePayoff, newUpPrice, downStatePrice);
								setPutDelta(newPutDelta);

								let newPutB = calcBParam(intRate, newVal, dParam, newPutUpPayoff, putDownStatePayoff);
								setPutBParam(newPutB);

								setPutPrice(calcOptionPrice(spotPrice, newPutDelta, newPutB));
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
								let newVal = event.target.value;
								setdParam(newVal);

								let newDownPrice = spotPrice * newVal;
								setDownStatePrice(newDownPrice);

								// CALL

								let newCallDownPayoff = calcStatePayoff(newDownPrice, strikePrice, true);
								setCallDownStatePayoff(newCallDownPayoff);

								let newCallDelta = calcDelta(callUpStatePayoff, newCallDownPayoff, upStatePrice, newDownPrice);
								setCallDelta(newCallDelta);

								let newCallB = calcBParam(intRate, uParam, newVal, callUpStatePayoff, newCallDownPayoff);
								setCallBParam(newCallB);

								setCallPrice(calcOptionPrice(spotPrice, newCallDelta, newCallB));

								// PUT

								let newPutDownPayoff = calcStatePayoff(newDownPrice, strikePrice, false);
								setPutDownStatePayoff(newPutDownPayoff);

								let newPutDelta = calcDelta(putUpStatePayoff, newPutDownPayoff, upStatePrice, newDownPrice);
								setPutDelta(newPutDelta);

								let newPutB = calcBParam(intRate, uParam, newVal, putUpStatePayoff, newPutDownPayoff);
								setPutBParam(newPutB);

								setPutPrice(calcOptionPrice(spotPrice, newPutDelta, newPutB));
							}}
						/>
					</InputGroup>
				</Col>
				<Col>
					<Form.Label>Gross Interest Rate</Form.Label>
					<InputGroup>
						<Form.Control
							value={intRate}
							onChange={(event) => {
								let newVal = event.target.value;
								setIntRate(newVal);

								// CALL

								let newCallB = calcBParam(newVal, uParam, dParam, callUpStatePayoff, callDownStatePayoff);
								setCallBParam(newCallB);

								setCallPrice(calcOptionPrice(spotPrice, callDelta, newCallB));

								// PUT

								let newPutB = calcBParam(newVal, uParam, dParam, putUpStatePayoff, putDownStatePayoff);
								setPutBParam(newPutB);

								setPutPrice(calcOptionPrice(spotPrice, putDelta, newPutB));
							}}
						/>
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

								let newU = newVal / spotPrice;
								setuParam(newU);

								// CALL

								let newCallUpPayoff = calcStatePayoff(newVal, strikePrice, true);
								setCallUpStatePayoff(newCallUpPayoff);

								let newCallDelta = calcDelta(newCallUpPayoff, callDownStatePayoff, newVal, downStatePrice);
								setCallDelta(newCallDelta);

								let newCallB = calcBParam(intRate, newU, dParam, newCallUpPayoff, callDownStatePayoff);
								setCallBParam(newCallB);

								setCallPrice(calcOptionPrice(spotPrice, newCallDelta, newCallB));

								// PUT

								let newPutUpPayoff = calcStatePayoff(newVal, strikePrice, false);
								setPutUpStatePayoff(newPutUpPayoff);

								let newPutDelta = calcDelta(newPutUpPayoff, putDownStatePayoff, newVal, downStatePrice);
								setPutDelta(newPutDelta);

								let newPutB = calcBParam(intRate, newU, dParam, newPutUpPayoff, putDownStatePayoff);
								setPutBParam(newPutB);

								setPutPrice(calcOptionPrice(spotPrice, newPutDelta, newPutB));
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

								let newD = newVal / spotPrice;
								setdParam(newD);

								// CALL

								let newCallDownPayoff = calcStatePayoff(newVal, strikePrice, true);
								setCallDownStatePayoff(newCallDownPayoff);

								let newCallDelta = calcDelta(callUpStatePayoff, newCallDownPayoff, upStatePrice, newVal);
								setCallDelta(newCallDelta);

								let newCallB = calcBParam(intRate, uParam, newD, callUpStatePayoff, newCallDownPayoff);
								setCallBParam(newCallB);

								setCallPrice(calcOptionPrice(spotPrice, newCallDelta, newCallB));

								// PUT

								let newPutDownPayoff = calcStatePayoff(newVal, strikePrice, false);
								setPutDownStatePayoff(newPutDownPayoff);

								let newPutDelta = calcDelta(putUpStatePayoff, newPutDownPayoff, upStatePrice, newVal);
								setPutDelta(newPutDelta);

								let newPutB = calcBParam(intRate, uParam, newD, putUpStatePayoff, newPutDownPayoff);
								setPutBParam(newPutB);

								setPutPrice(calcOptionPrice(spotPrice, newPutDelta, newPutB));
							}}
						/>
					</InputGroup>
				</Col>
			</Row>
			<Row>
				<Col>
					{/* CALL */}
					<p></p>
					<h2>Call Output</h2>
					<Row>
						<Col>
							<Form.Label>Up State Payoff (Gross)</Form.Label>
							<InputGroup>
								<InputGroup.Text>$</InputGroup.Text>
								<Form.Control disabled value={callUpStatePayoff} />
							</InputGroup>
						</Col>
						<Col>
							<Form.Label>Down State Payoff (Gross)</Form.Label>
							<InputGroup>
								<InputGroup.Text>$</InputGroup.Text>
								<Form.Control disabled value={callDownStatePayoff} />
							</InputGroup>
						</Col>
					</Row>
					<Row>
						<Col>
							<Form.Label>Delta</Form.Label>
							<InputGroup>
								<Form.Control disabled value={callDelta} />
							</InputGroup>
						</Col>
						<Col>
							<Form.Label>B-Parameter</Form.Label>
							<InputGroup>
								<Form.Control disabled value={callBParam} />
							</InputGroup>
						</Col>
					</Row>
					<Col>
						<Form.Label>Call Price</Form.Label>
						<InputGroup>
							<InputGroup.Text>$</InputGroup.Text>
							<Form.Control disabled value={callPrice} />
						</InputGroup>
					</Col>
				</Col>
				<Col>
					{/* PUT*/}
					<p></p>
					<h2>Put Output</h2>
					<Row>
						<Col>
							<Form.Label>Up State Payoff (Gross)</Form.Label>
							<InputGroup>
								<InputGroup.Text>$</InputGroup.Text>
								<Form.Control disabled value={putUpStatePayoff} />
							</InputGroup>
						</Col>
						<Col>
							<Form.Label>Down State Payoff (Gross)</Form.Label>
							<InputGroup>
								<InputGroup.Text>$</InputGroup.Text>
								<Form.Control disabled value={putDownStatePayoff} />
							</InputGroup>
						</Col>
					</Row>
					<Row>
						<Col>
							<Form.Label>Delta</Form.Label>
							<InputGroup>
								<Form.Control disabled value={putDelta} />
							</InputGroup>
						</Col>
						<Col>
							<Form.Label>B-Parameter</Form.Label>
							<InputGroup>
								<Form.Control disabled value={putBParam} />
							</InputGroup>
						</Col>
					</Row>
					<Col>
						<Form.Label>Put Price</Form.Label>
						<InputGroup>
							<InputGroup.Text>$</InputGroup.Text>
							<Form.Control disabled value={putPrice} />
						</InputGroup>
					</Col>
				</Col>
			</Row>
		</Container>
	);
}
