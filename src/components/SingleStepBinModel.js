import React from 'react';
import { Col, Container, Row, Form, InputGroup, ButtonGroup, Button } from 'react-bootstrap';
import { useState } from 'react';

export default function SingleStepBinModel() {
	const [S, setS] = useState(100);
	const [K, setK] = useState(110);
	const [uParam, setuParam] = useState(1.2);
	const [dParam, setdParam] = useState(0.9);
	const [R, setR] = useState(1.02);
	const [Su, setSu] = useState(120);
	const [Sd, setSd] = useState(90);
	const solverMethods = {
		rp: 'Replication Portfolio',
		rnp: 'Risk-Neutral Pricing',
	};
	const [solverMethod, setSolverMethod] = useState(solverMethods.rp);

	const [callXu, setCallXu] = useState(10);
	const [callXd, setCallXd] = useState(0);
	const [callDelta, setCallDelta] = useState(0.3333333333333333);
	const [callBParam, setCallBParam] = useState(-29.411764705882355);
	const [callPrice, setCallPrice] = useState(3.9215686274509736);

	const [putXu, setPutXu] = useState(0);
	const [putXd, setPutXd] = useState(20);
	const [putDelta, setPutDelta] = useState(-0.6666666666666666);
	const [putBParam, setPutBParam] = useState(78.43137254901961);
	const [putPrice, setPutPrice] = useState(11.764705882352956);

	const [q, setQ] = useState(0.4000000000000001);
	const [callPriceRNP, setCallPriceRNP] = useState(3.921568627450981);
	const [putPriceRNP, setPutPriceRNP] = useState(11.764705882352937);

	function calcStatePayoff(spot, strike, isCall) {
		let payoff = -1;
		if (isCall) {
			payoff = Math.max(0, spot - strike);
		} else {
			payoff = Math.max(0, strike - spot);
		}
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
			<p></p>
			<h1>General Inputs</h1>
			<Row>
				<Col>
					<Form.Label>Spot Price</Form.Label>
					<InputGroup>
						<InputGroup.Text>$</InputGroup.Text>
						<Form.Control
							value={S}
							onChange={(event) => {
								let newVal = event.target.value;
								setS(newVal);

								let newUpPrice = newVal * uParam;
								setSu(newUpPrice);

								let newDownPrice = newVal * dParam;
								setSd(newDownPrice);

								// CALL

								let newCallUpPayoff = calcStatePayoff(newUpPrice, K, true);
								setCallXu(newCallUpPayoff);

								let newCallDownPayoff = calcStatePayoff(newDownPrice, K, true);
								setCallXd(newCallDownPayoff);

								let newCallDelta = calcDelta(newCallUpPayoff, newCallDownPayoff, newUpPrice, newDownPrice);
								setCallDelta(newCallDelta);

								let newCallB = calcBParam(R, uParam, dParam, newCallUpPayoff, newCallDownPayoff);
								setCallBParam(newCallB);

								// PUT

								let newPutUpPayoff = calcStatePayoff(newUpPrice, K, false);
								setPutXu(newPutUpPayoff);

								let newPutDownPayoff = calcStatePayoff(newDownPrice, K, false);
								setPutXd(newPutDownPayoff);

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
							value={K}
							onChange={(event) => {
								let newVal = event.target.value;
								setK(newVal);

								// CALL

								let newCallUpPayoff = calcStatePayoff(Su, newVal, true);
								setCallXu(newCallUpPayoff);

								let newCallDownPayoff = calcStatePayoff(Sd, newVal, true);
								setCallXd(newCallDownPayoff);

								let newCallDelta = calcDelta(newCallUpPayoff, newCallDownPayoff, Su, Sd);
								setCallDelta(newCallDelta);

								let newCallB = calcBParam(R, uParam, dParam, newCallUpPayoff, newCallDownPayoff);
								setCallBParam(newCallB);

								setCallPrice(calcOptionPrice(S, newCallDelta, newCallB));

								// PUT

								let newPutUpPayoff = calcStatePayoff(Su, newVal, false);
								setPutXu(newPutUpPayoff);

								let newPutDownPayoff = calcStatePayoff(Sd, newVal, false);
								setPutXd(newPutDownPayoff);

								let newPutDelta = calcDelta(newPutUpPayoff, newPutDownPayoff, Su, Sd);
								setPutDelta(newPutDelta);

								let newPutB = calcBParam(R, uParam, dParam, newPutUpPayoff, newPutDownPayoff);
								setPutBParam(newPutB);

								setPutPrice(calcOptionPrice(S, newPutDelta, newPutB));

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

								let newUpPrice = S * newVal;
								setSu(newUpPrice);

								// CALL

								let newCallUpPayoff = calcStatePayoff(newUpPrice, K, true);
								setCallXu(newCallUpPayoff);

								let newCallDelta = calcDelta(newCallUpPayoff, callXd, newUpPrice, Sd);
								setCallDelta(newCallDelta);

								let newCallB = calcBParam(R, newVal, dParam, newCallUpPayoff, callXd);
								setCallBParam(newCallB);

								setCallPrice(calcOptionPrice(S, newCallDelta, newCallB));

								// PUT

								let newPutUpPayoff = calcStatePayoff(newUpPrice, K, false);
								setPutXu(newPutUpPayoff);

								let newPutDelta = calcDelta(newPutUpPayoff, putXd, newUpPrice, Sd);
								setPutDelta(newPutDelta);

								let newPutB = calcBParam(R, newVal, dParam, newPutUpPayoff, putXd);
								setPutBParam(newPutB);

								setPutPrice(calcOptionPrice(S, newPutDelta, newPutB));

								// RNP
								let newQ = calcQ(R, newVal, dParam);
								setQ(newQ);

								setCallPriceRNP(calcOptionPriceRNP(newQ, R, newCallUpPayoff, callXd));
								setPutPriceRNP(calcOptionPriceRNP(newQ, R, newPutUpPayoff, putXd));
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

								let newDownPrice = S * newVal;
								setSd(newDownPrice);

								// CALL

								let newCallDownPayoff = calcStatePayoff(newDownPrice, K, true);
								setCallXd(newCallDownPayoff);

								let newCallDelta = calcDelta(callXu, newCallDownPayoff, Su, newDownPrice);
								setCallDelta(newCallDelta);

								let newCallB = calcBParam(R, uParam, newVal, callXu, newCallDownPayoff);
								setCallBParam(newCallB);

								setCallPrice(calcOptionPrice(S, newCallDelta, newCallB));

								// PUT

								let newPutDownPayoff = calcStatePayoff(newDownPrice, K, false);
								setPutXd(newPutDownPayoff);

								let newPutDelta = calcDelta(putXu, newPutDownPayoff, Su, newDownPrice);
								setPutDelta(newPutDelta);

								let newPutB = calcBParam(R, uParam, newVal, putXu, newPutDownPayoff);
								setPutBParam(newPutB);

								setPutPrice(calcOptionPrice(S, newPutDelta, newPutB));

								// RNP
								let newQ = calcQ(R, uParam, newVal);
								setQ(newQ);

								setCallPriceRNP(calcOptionPriceRNP(newQ, R, callXu, newCallDownPayoff));
								setPutPriceRNP(calcOptionPriceRNP(newQ, R, putXu, newPutDownPayoff));
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

								let newCallB = calcBParam(newVal, uParam, dParam, callXu, callXd);
								setCallBParam(newCallB);

								setCallPrice(calcOptionPrice(S, callDelta, newCallB));

								// PUT

								let newPutB = calcBParam(newVal, uParam, dParam, putXu, putXd);
								setPutBParam(newPutB);

								setPutPrice(calcOptionPrice(S, putDelta, newPutB));

								// RNP
								let newQ = calcQ(newVal, uParam, dParam);
								setQ(newQ);

								setCallPriceRNP(calcOptionPriceRNP(newQ, newVal, callXu, callXd));
								setPutPriceRNP(calcOptionPriceRNP(newQ, newVal, putXu, putXd));
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
							value={Su}
							onChange={(event) => {
								let newVal = event.target.value;
								setSu(newVal);

								let newU = newVal / S;
								setuParam(newU);

								// CALL

								let newCallUpPayoff = calcStatePayoff(newVal, K, true);
								setCallXu(newCallUpPayoff);

								let newCallDelta = calcDelta(newCallUpPayoff, callXd, newVal, Sd);
								setCallDelta(newCallDelta);

								let newCallB = calcBParam(R, newU, dParam, newCallUpPayoff, callXd);
								setCallBParam(newCallB);

								setCallPrice(calcOptionPrice(S, newCallDelta, newCallB));

								// PUT

								let newPutUpPayoff = calcStatePayoff(newVal, K, false);
								setPutXu(newPutUpPayoff);

								let newPutDelta = calcDelta(newPutUpPayoff, putXd, newVal, Sd);
								setPutDelta(newPutDelta);

								let newPutB = calcBParam(R, newU, dParam, newPutUpPayoff, putXd);
								setPutBParam(newPutB);

								setPutPrice(calcOptionPrice(S, newPutDelta, newPutB));

								// RNP
								let newQ = calcQ(R, newU, dParam);
								setQ(newQ);

								setCallPriceRNP(calcOptionPriceRNP(newQ, R, newCallUpPayoff, callXd));
								setPutPriceRNP(calcOptionPriceRNP(newQ, R, newPutUpPayoff, putXd));
							}}
						/>
					</InputGroup>
				</Col>
				<Col>
					<Form.Label>Down State Price</Form.Label>
					<InputGroup>
						<InputGroup.Text>$</InputGroup.Text>
						<Form.Control
							value={Sd}
							onChange={(event) => {
								let newVal = event.target.value;
								setSd(newVal);

								let newD = newVal / S;
								setdParam(newD);

								// CALL

								let newCallDownPayoff = calcStatePayoff(newVal, K, true);
								setCallXd(newCallDownPayoff);

								let newCallDelta = calcDelta(callXu, newCallDownPayoff, Su, newVal);
								setCallDelta(newCallDelta);

								let newCallB = calcBParam(R, uParam, newD, callXu, newCallDownPayoff);
								setCallBParam(newCallB);

								setCallPrice(calcOptionPrice(S, newCallDelta, newCallB));

								// PUT

								let newPutDownPayoff = calcStatePayoff(newVal, K, false);
								setPutXd(newPutDownPayoff);

								let newPutDelta = calcDelta(putXu, newPutDownPayoff, Su, newVal);
								setPutDelta(newPutDelta);

								let newPutB = calcBParam(R, uParam, newD, putXu, newPutDownPayoff);
								setPutBParam(newPutB);

								setPutPrice(calcOptionPrice(S, newPutDelta, newPutB));

								// RNP
								let newQ = calcQ(R, uParam, newD);
								setQ(newQ);

								setCallPriceRNP(calcOptionPriceRNP(newQ, R, callXu, newCallDownPayoff));
								setPutPriceRNP(calcOptionPriceRNP(newQ, R, putXu, newPutDownPayoff));
							}}
						/>
					</InputGroup>
				</Col>
				<Col>
					<Form.Label>Solver Method</Form.Label>
					<ButtonGroup>
						<Button variant={solverMethod === solverMethods.rp ? 'danger' : 'secondary'} onClick={() => setSolverMethod(solverMethods.rp)}>
							{solverMethods.rp}
						</Button>
						<Button variant={solverMethod === solverMethods.rnp ? 'danger' : 'secondary'} onClick={() => setSolverMethod(solverMethods.rnp)}>
							{solverMethods.rnp}
						</Button>
					</ButtonGroup>
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
									<Form.Control disabled value={callXu} />
								</InputGroup>
							</Col>
							<Col>
								<Form.Label>Down State Payoff (Gross)</Form.Label>
								<InputGroup>
									<InputGroup.Text>$</InputGroup.Text>
									<Form.Control disabled value={callXd} />
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
									<Form.Control disabled value={putXu} />
								</InputGroup>
							</Col>
							<Col>
								<Form.Label>Down State Payoff (Gross)</Form.Label>
								<InputGroup>
									<InputGroup.Text>$</InputGroup.Text>
									<Form.Control disabled value={putXd} />
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
										<Form.Control disabled value={callXu} />
									</InputGroup>
								</Col>
								<Col>
									<Form.Label>Down State Payoff (Gross)</Form.Label>
									<InputGroup>
										<InputGroup.Text>$</InputGroup.Text>
										<Form.Control disabled value={callXd} />
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
										<Form.Control disabled value={putXu} />
									</InputGroup>
								</Col>
								<Col>
									<Form.Label>Down State Payoff (Gross)</Form.Label>
									<InputGroup>
										<InputGroup.Text>$</InputGroup.Text>
										<Form.Control disabled value={putXd} />
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
