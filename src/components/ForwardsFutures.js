import React from 'react';
import { Col, Container, Row, Form, InputGroup, Button, OverlayTrigger, Tooltip, Overlay } from 'react-bootstrap';
import { useState } from 'react';
import * as ffl from '../logic/ForwardsFuturesLib.js';
import OutputTextbox from './OutputTextbox.js';

export default function ForwardsFutures() {
	const [F, setF] = useState(100);
	const [Ft, setFt] = useState(120);
	const [n, setn] = useState(10);
	const [N, setN] = useState(2);
	const [R, setR] = useState(0);
	const [T, setT] = useState(0);

	const [longPayoff, setLongPayoff] = useState(0);
	const [shortPayoff, setShortPayoff] = useState(0);

	const fields = {
		F: 'Futures Price',
		Ft: 'Futures Price at Close',
		n: 'Units per Contract',
		N: 'Contracts',
		R: 'Interest Rate',
		T: 'Time',
		longPayoff: 'Long Payoff',
		shortPayoff: 'Short Payoff',
	};

	// todo finish these
	const descriptions = {
		F: 'Futures Price',
		Ft: 'Futures Price at Close',
		n: 'Units per Contract',
		N: 'Contracts',
		R: 'Interest Rate',
		T: 'Time',
		longPayoff: 'Long Payoff',
		shortPayoff: 'Short Payoff',
	};

	function handleCalcModel() {
		setLongPayoff(ffl.calcFuturesPayoff(F, Ft, n, N, true));
		setShortPayoff(ffl.calcFuturesPayoff(F, Ft, n, N, false));
	}

	return (
		<Container>
			<h1>Futures Payoffs</h1>
			<p></p>
			<h2>Inputs</h2>
			<Row>
				<Col>
					<OverlayTrigger placement='right' overlay={<Tooltip>{descriptions.F}</Tooltip>}>
						<Form.Label>{fields.F}</Form.Label>
					</OverlayTrigger>
					<InputGroup>
						<InputGroup.Text>$</InputGroup.Text>
						<Form.Control
							value={F}
							onChange={(event) => {
								let newVal = event.target.value;
								setF(newVal);
							}}
						/>
					</InputGroup>
				</Col>
				<Col>
					<OverlayTrigger placement='right' overlay={<Tooltip>{descriptions.Ft}</Tooltip>}>
						<Form.Label>{fields.Ft}</Form.Label>
					</OverlayTrigger>
					<InputGroup>
						<InputGroup.Text>$</InputGroup.Text>
						<Form.Control
							value={Ft}
							onChange={(event) => {
								let newVal = event.target.value;
								setFt(newVal);
							}}
						/>
					</InputGroup>
				</Col>
				<Col>
					<OverlayTrigger placement='right' overlay={<Tooltip>{descriptions.n}</Tooltip>}>
						<Form.Label>{fields.n}</Form.Label>
					</OverlayTrigger>
					<InputGroup>
						<Form.Control
							value={n}
							onChange={(event) => {
								let newVal = event.target.value;
								setn(newVal);
							}}
						/>
					</InputGroup>
				</Col>
				<Col>
					<OverlayTrigger placement='right' overlay={<Tooltip>{descriptions.N}</Tooltip>}>
						<Form.Label>{fields.N}</Form.Label>
					</OverlayTrigger>
					<InputGroup>
						<Form.Control
							value={N}
							onChange={(event) => {
								let newVal = event.target.value;
								setN(newVal);
							}}
						/>
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
				<OutputTextbox title={fields.longPayoff} description={descriptions.longPayoff} value={longPayoff} />
				<OutputTextbox title={fields.shortPayoff} description={descriptions.shortPayoff} value={shortPayoff} />
			</Row>
		</Container>
	);
}
