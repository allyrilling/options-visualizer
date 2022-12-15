import React from 'react';
import { Col, Container, Row, Form, InputGroup, Button, OverlayTrigger, Tooltip, Popover } from 'react-bootstrap';
import { useState } from 'react';
import * as bsl from '../logic/BlackScholesLib.js';

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

	const [deltaCall, setDeltaCall] = useState(0);
	const [deltaPut, setDeltaPut] = useState(0);
	const [gamma, setGamma] = useState(0);
	const [vega, setVega] = useState(0);
	const [thetaCall, setThetaCall] = useState(0);
	const [thetaPut, setThetaPut] = useState(0);
	const [rhoCall, setRhoCall] = useState(0);
	const [rhoPut, setRhoPut] = useState(0);

	const timeUnits = {
		years: 'Years',
		months: 'Months -> Years',
		weeks: 'Weeks -> Years',
		days365: 'Days (365 days / year) -> Years',
		days252: 'Days (252 days / year) -> Years',
	};

	const [timeUnit, setTimeUnit] = useState(timeUnits.years);

	const fields = {
		spotPrice: 'Spot Price',
		sigma: 'Sigma σ',
		divYield: 'Dividend Yield 𝛿',
		strikePrice: 'Strike Price',
		time: 'Time',
		rate: 'Interest Rate',
		callPrice: 'Call Price',
		putPrice: 'Put Price',
		deltaCall: 'Call Delta Δ',
		deltaPut: 'Put Delta Δ',
		gamma: 'Gamma Γ',
		vega: 'Vega ν',
		thetaCall: 'Call Theta ϴ',
		thetaPut: 'Put Theta ϴ',
		rhoCall: 'Call Rho ρ',
		rhoPut: 'Put Rho ρ',
	};

	const descriptions = {
		spotPrice: 'Current price of the underlying',
		sigma: 'Volatility of the underlying',
		divYield: 'Continuously-compounded dividend yield of the underlying',
		strikePrice: 'Strike price of options contract',
		time: 'Time remaining until expiration of options contract',
		rate: 'Current risk-free interest rate',
		callPrice: 'Price of the call option',
		putPrice: 'Price of the put option',
		deltaCall: 'Change in call price per $1 change in price of the underlying',
		deltaPut: 'Change in put price per $1 change in price of the underlying',
		gamma: 'Change in delta per $1 change in price of the underlying',
		vega: 'Change in option price per 1% change in sigma',
		thetaCall: 'Change in call price per 1 day passed',
		thetaPut: 'Change in put price per 1 day passed',
		rhoCall: 'Change in call price per 1% change in the interest rate',
		rhoPut: 'Change in put price per 1% change in the interest rate',
	};

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

		setDeltaCall(bsl.delta(S, sig, K, T, r, dy, true));
		setDeltaPut(bsl.delta(S, sig, K, T, r, dy, false));
		setGamma(bsl.gamma(S, sig, K, T, r, dy));
		setVega(bsl.vega(S, sig, K, T, r, dy));
		setThetaCall(bsl.theta(S, sig, K, T, r, dy, true));
		setThetaPut(bsl.theta(S, sig, K, T, r, dy, false));
		setRhoCall(bsl.rho(S, sig, K, T, r, dy, true));
		setRhoPut(bsl.rho(S, sig, K, T, r, dy, false));
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
			<h1>Option Prices and Greeks</h1>
			<p></p>
			<h2>Inputs</h2>
			<Row>
				<Col>
					<OverlayTrigger placement='right' overlay={<Tooltip>{descriptions.spotPrice}</Tooltip>}>
						<Form.Label>{fields.spotPrice}</Form.Label>
					</OverlayTrigger>
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
					<OverlayTrigger placement='right' overlay={<Tooltip>{descriptions.sigma}</Tooltip>}>
						<Form.Label>{fields.sigma}</Form.Label>
					</OverlayTrigger>
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
					<OverlayTrigger placement='right' overlay={<Tooltip>{descriptions.divYield}</Tooltip>}>
						<Form.Label>{fields.divYield}</Form.Label>
					</OverlayTrigger>
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
					<OverlayTrigger placement='right' overlay={<Tooltip>{descriptions.strikePrice}</Tooltip>}>
						<Form.Label>{fields.strikePrice}</Form.Label>
					</OverlayTrigger>
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
					<OverlayTrigger placement='right' overlay={<Tooltip>{descriptions.time}</Tooltip>}>
						<Form.Label>{fields.time}</Form.Label>
					</OverlayTrigger>
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
					<OverlayTrigger placement='right' overlay={<Tooltip>{descriptions.rate}</Tooltip>}>
						<Form.Label>{fields.rate}</Form.Label>
					</OverlayTrigger>
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
			<h2>Prices</h2>
			<Row>
				<Col>
					<OverlayTrigger placement='right' overlay={<Tooltip>{descriptions.callPrice}</Tooltip>}>
						<Form.Label>{fields.callPrice}</Form.Label>
					</OverlayTrigger>
					<InputGroup>
						<InputGroup.Text>$</InputGroup.Text>
						<Form.Control disabled value={callPrice} />
					</InputGroup>
				</Col>
				<Col>
					<OverlayTrigger placement='right' overlay={<Tooltip>{descriptions.putPrice}</Tooltip>}>
						<Form.Label>{fields.putPrice}</Form.Label>
					</OverlayTrigger>
					<InputGroup>
						<InputGroup.Text>$</InputGroup.Text>
						<Form.Control disabled value={putPrice} />
					</InputGroup>
				</Col>
			</Row>
			<p></p>
			<h2>Greeks</h2>
			<Row>
				<Col>
					<OverlayTrigger placement='right' overlay={<Tooltip>{descriptions.deltaCall}</Tooltip>}>
						<Form.Label>{fields.deltaCall}</Form.Label>
					</OverlayTrigger>
					<InputGroup>
						<Form.Control disabled value={deltaCall} />
					</InputGroup>
				</Col>
				<Col>
					<OverlayTrigger placement='right' overlay={<Tooltip>{descriptions.deltaPut}</Tooltip>}>
						<Form.Label>{fields.deltaPut}</Form.Label>
					</OverlayTrigger>
					<InputGroup>
						<Form.Control disabled value={deltaPut} />
					</InputGroup>
				</Col>
				<Col>
					<OverlayTrigger placement='right' overlay={<Tooltip>{descriptions.gamma}</Tooltip>}>
						<Form.Label>{fields.gamma}</Form.Label>
					</OverlayTrigger>
					<InputGroup>
						<Form.Control disabled value={gamma} />
					</InputGroup>
				</Col>
				<Col>
					<OverlayTrigger placement='right' overlay={<Tooltip>{descriptions.vega}</Tooltip>}>
						<Form.Label>{fields.vega}</Form.Label>
					</OverlayTrigger>
					<InputGroup>
						<Form.Control disabled value={vega} />
					</InputGroup>
				</Col>
			</Row>
			<p></p>
			<Row>
				<Col>
					<OverlayTrigger placement='right' overlay={<Tooltip>{descriptions.thetaCall}</Tooltip>}>
						<Form.Label>{fields.thetaCall}</Form.Label>
					</OverlayTrigger>
					<InputGroup>
						<Form.Control disabled value={thetaCall} />
					</InputGroup>
				</Col>
				<Col>
					<OverlayTrigger placement='right' overlay={<Tooltip>{descriptions.thetaPut}</Tooltip>}>
						<Form.Label>{fields.thetaPut}</Form.Label>
					</OverlayTrigger>
					<InputGroup>
						<Form.Control disabled value={thetaPut} />
					</InputGroup>
				</Col>
				<Col>
					<OverlayTrigger placement='right' overlay={<Tooltip>{descriptions.rhoCall}</Tooltip>}>
						<Form.Label>{fields.rhoCall}</Form.Label>
					</OverlayTrigger>
					<InputGroup>
						<Form.Control disabled value={rhoCall} />
					</InputGroup>
				</Col>
				<Col>
					<OverlayTrigger placement='right' overlay={<Tooltip>{descriptions.rhoPut}</Tooltip>}>
						<Form.Label>{fields.rhoPut}</Form.Label>
					</OverlayTrigger>
					<InputGroup>
						<Form.Control disabled value={rhoPut} />
					</InputGroup>
				</Col>
			</Row>
			<p></p>
			<h2>Auxillary Outputs</h2>
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
		</Container>
	);
}
