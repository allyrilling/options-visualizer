import React from 'react';
import { Col, Container, Row, Form, InputGroup } from 'react-bootstrap';
import { useState } from 'react';

export default function BinModel() {
	const [spotPrice, setSpotPrice] = useState(100);
	const [strikePrice, setStrikePrice] = useState(110);
	const [uParam, setuParam] = useState(1.2);
	const [dParam, setdParam] = useState(0.9);
	const [R, setR] = useState(1.02);
	const [upStatePrice, setUpStatePrice] = useState(120);
	const [downStatePrice, setDownStatePrice] = useState(90);
	const solverMethods = {
		rp: 'Replication Portfolio',
		rnp: 'Risk-Neutral Pricing',
	};
	const [solverMethod, setSolverMethod] = useState(solverMethods.rp);

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

	const [q, setQ] = useState(0.4000000000000001);
	const [callPriceRNP, setCallPriceRNP] = useState(3.921568627450981);
	const [putPriceRNP, setPutPriceRNP] = useState(11.764705882352937);

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

	function calcQ(R, u, d) {
		return (R - d) / (u - d);
	}

	function calcOptionPriceRNP(q, r, upPayoff, downPayoff) {
		return (1 / r) * (q * upPayoff + (1 - q) * downPayoff);
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

								let newCallB = calcBParam(R, uParam, dParam, newCallUpPayoff, newCallDownPayoff);
								setCallBParam(newCallB);

								// PUT

								let newPutUpPayoff = calcStatePayoff(newUpPrice, strikePrice, false);
								setPutUpStatePayoff(newPutUpPayoff);

								let newPutDownPayoff = calcStatePayoff(newDownPrice, strikePrice, false);
								setPutDownStatePayoff(newPutDownPayoff);

								let newPutDelta = calcDelta(newPutUpPayoff, newPutDownPayoff, newUpPrice, newDownPrice);
								setPutDelta(newPutDelta);

								let newPutB = calcBParam(R, uParam, dParam, newPutUpPayoff, newPutDownPayoff);
								setPutBParam(newPutB);

								setPutPrice(calcOptionPrice(newVal, newPutDelta, newPutB));

								// RNP
								setCallPriceRNP(calcOptionPriceRNP(q, R, newCallUpPayoff, newCallDownPayoff));
								setPutPriceRNP(calcOptionPriceRNP(q, R, newPutUpPayoff, newPutDownPayoff));
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

								let newCallB = calcBParam(R, uParam, dParam, newCallUpPayoff, newCallDownPayoff);
								setCallBParam(newCallB);

								setCallPrice(calcOptionPrice(spotPrice, newCallDelta, newCallB));

								// PUT

								let newPutUpPayoff = calcStatePayoff(upStatePrice, newVal, false);
								setPutUpStatePayoff(newPutUpPayoff);

								let newPutDownPayoff = calcStatePayoff(downStatePrice, newVal, false);
								setPutDownStatePayoff(newPutDownPayoff);

								let newPutDelta = calcDelta(newPutUpPayoff, newPutDownPayoff, upStatePrice, downStatePrice);
								setPutDelta(newPutDelta);

								let newPutB = calcBParam(R, uParam, dParam, newPutUpPayoff, newPutDownPayoff);
								setPutBParam(newPutB);

								setPutPrice(calcOptionPrice(spotPrice, newPutDelta, newPutB));

								// RNP
								setCallPriceRNP(calcOptionPriceRNP(q, R, newCallUpPayoff, newCallDownPayoff));
								setPutPriceRNP(calcOptionPriceRNP(q, R, newPutUpPayoff, newPutDownPayoff));
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

								let newCallB = calcBParam(R, newVal, dParam, newCallUpPayoff, callDownStatePayoff);
								setCallBParam(newCallB);

								setCallPrice(calcOptionPrice(spotPrice, newCallDelta, newCallB));

								// PUT

								let newPutUpPayoff = calcStatePayoff(newUpPrice, strikePrice, false);
								setPutUpStatePayoff(newPutUpPayoff);

								let newPutDelta = calcDelta(newPutUpPayoff, putDownStatePayoff, newUpPrice, downStatePrice);
								setPutDelta(newPutDelta);

								let newPutB = calcBParam(R, newVal, dParam, newPutUpPayoff, putDownStatePayoff);
								setPutBParam(newPutB);

								setPutPrice(calcOptionPrice(spotPrice, newPutDelta, newPutB));

								// RNP
								let newQ = calcQ(R, newVal, dParam);
								setQ(newQ);

								setCallPriceRNP(calcOptionPriceRNP(newQ, R, newCallUpPayoff, callDownStatePayoff));
								setPutPriceRNP(calcOptionPriceRNP(newQ, R, newPutUpPayoff, putDownStatePayoff));
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

								let newCallB = calcBParam(R, uParam, newVal, callUpStatePayoff, newCallDownPayoff);
								setCallBParam(newCallB);

								setCallPrice(calcOptionPrice(spotPrice, newCallDelta, newCallB));

								// PUT

								let newPutDownPayoff = calcStatePayoff(newDownPrice, strikePrice, false);
								setPutDownStatePayoff(newPutDownPayoff);

								let newPutDelta = calcDelta(putUpStatePayoff, newPutDownPayoff, upStatePrice, newDownPrice);
								setPutDelta(newPutDelta);

								let newPutB = calcBParam(R, uParam, newVal, putUpStatePayoff, newPutDownPayoff);
								setPutBParam(newPutB);

								setPutPrice(calcOptionPrice(spotPrice, newPutDelta, newPutB));

								// RNP
								let newQ = calcQ(R, uParam, newVal);
								setQ(newQ);

								setCallPriceRNP(calcOptionPriceRNP(newQ, R, callUpStatePayoff, newCallDownPayoff));
								setPutPriceRNP(calcOptionPriceRNP(newQ, R, putUpStatePayoff, newPutDownPayoff));
							}}
						/>
					</InputGroup>
				</Col>
				<Col>
					<Form.Label>Gross Interest Rate</Form.Label>
					<InputGroup>
						<Form.Control
							value={R}
							onChange={(event) => {
								let newVal = event.target.value;
								setR(newVal);

								// CALL

								let newCallB = calcBParam(newVal, uParam, dParam, callUpStatePayoff, callDownStatePayoff);
								setCallBParam(newCallB);

								setCallPrice(calcOptionPrice(spotPrice, callDelta, newCallB));

								// PUT

								let newPutB = calcBParam(newVal, uParam, dParam, putUpStatePayoff, putDownStatePayoff);
								setPutBParam(newPutB);

								setPutPrice(calcOptionPrice(spotPrice, putDelta, newPutB));

								// RNP
								let newQ = calcQ(newVal, uParam, dParam);
								setQ(newQ);

								setCallPriceRNP(calcOptionPriceRNP(newQ, newVal, callUpStatePayoff, callDownStatePayoff));
								setPutPriceRNP(calcOptionPriceRNP(newQ, newVal, putUpStatePayoff, putDownStatePayoff));
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

								let newCallB = calcBParam(R, newU, dParam, newCallUpPayoff, callDownStatePayoff);
								setCallBParam(newCallB);

								setCallPrice(calcOptionPrice(spotPrice, newCallDelta, newCallB));

								// PUT

								let newPutUpPayoff = calcStatePayoff(newVal, strikePrice, false);
								setPutUpStatePayoff(newPutUpPayoff);

								let newPutDelta = calcDelta(newPutUpPayoff, putDownStatePayoff, newVal, downStatePrice);
								setPutDelta(newPutDelta);

								let newPutB = calcBParam(R, newU, dParam, newPutUpPayoff, putDownStatePayoff);
								setPutBParam(newPutB);

								setPutPrice(calcOptionPrice(spotPrice, newPutDelta, newPutB));

								// RNP
								let newQ = calcQ(R, newU, dParam);
								setQ(newQ);

								setCallPriceRNP(calcOptionPriceRNP(newQ, R, newCallUpPayoff, callDownStatePayoff));
								setPutPriceRNP(calcOptionPriceRNP(newQ, R, newPutUpPayoff, putDownStatePayoff));
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

								let newCallB = calcBParam(R, uParam, newD, callUpStatePayoff, newCallDownPayoff);
								setCallBParam(newCallB);

								setCallPrice(calcOptionPrice(spotPrice, newCallDelta, newCallB));

								// PUT

								let newPutDownPayoff = calcStatePayoff(newVal, strikePrice, false);
								setPutDownStatePayoff(newPutDownPayoff);

								let newPutDelta = calcDelta(putUpStatePayoff, newPutDownPayoff, upStatePrice, newVal);
								setPutDelta(newPutDelta);

								let newPutB = calcBParam(R, uParam, newD, putUpStatePayoff, newPutDownPayoff);
								setPutBParam(newPutB);

								setPutPrice(calcOptionPrice(spotPrice, newPutDelta, newPutB));

								// RNP
								let newQ = calcQ(R, uParam, newD);
								setQ(newQ);

								setCallPriceRNP(calcOptionPriceRNP(newQ, R, callUpStatePayoff, newCallDownPayoff));
								setPutPriceRNP(calcOptionPriceRNP(newQ, R, putUpStatePayoff, newPutDownPayoff));
							}}
						/>
					</InputGroup>
				</Col>
				<Col>
					<Form.Label>Solver Method</Form.Label>
					<Form.Select value={solverMethod} onChange={(event) => setSolverMethod(event.target.value)}>
						<option>{solverMethods.rp}</option>
						<option>{solverMethods.rnp}</option>
					</Form.Select>
				</Col>
			</Row>
			{solverMethod === solverMethods.rp ? (
				<Row>
					<p></p>
					<h1>{solverMethods.rp}</h1>
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
			) : (
				<Row>
					<p></p>
					<h1>{solverMethods.rnp}</h1>
					{/* CALL */}
					<Row>
						<Col>
							<Form.Label>q</Form.Label>
							<InputGroup>
								<Form.Control disabled value={q} />
							</InputGroup>
						</Col>
						<Col>
							<Form.Label>1-q</Form.Label>
							<InputGroup>
								<Form.Control disabled value={1 - q} />
							</InputGroup>
						</Col>
					</Row>
					<Row>
						<Col>
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
							<Col>
								<Form.Label>Call Price</Form.Label>
								<InputGroup>
									<InputGroup.Text>$</InputGroup.Text>
									<Form.Control disabled value={callPriceRNP} />
								</InputGroup>
							</Col>
						</Col>
						<Col>
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
							<Col>
								<Form.Label>Put Price</Form.Label>
								<InputGroup>
									<InputGroup.Text>$</InputGroup.Text>
									<Form.Control disabled value={putPriceRNP} />
								</InputGroup>
							</Col>
						</Col>
					</Row>
				</Row>
			)}
		</Container>
	);
}
