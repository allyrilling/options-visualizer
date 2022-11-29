import React from 'react';
import Node from '../logic/Node.js';
import { Col, Container, Row, Form, InputGroup, Button } from 'react-bootstrap';
import { useState } from 'react';

export default function MultiStepBinModel() {
	const [S, setS] = useState(100);
	const [K, setK] = useState(110);
	const [uParam, setuParam] = useState(1.2);
	const [dParam, setdParam] = useState(0.9);
	const [R, setR] = useState(1.02);
	const [steps, setSteps] = useState(1);
	const [q, setQ] = useState(0.4000000000000001);
	const [callPrice, setCallPrice] = useState(3.921568627450981);
	const [putPrice, setPutPrice] = useState(11.764705882352937);

	let model = new Node(null, S, 0);
	let currentNode = model;

	// recursive function to generate tree
	function calcModel(currentNode) {
		// base case
		if (currentNode.level === parseInt(steps)) {
			// dont create children
			currentNode.calcPayoffs(K);
			return;
		}
		currentNode.createChildren(uParam, dParam);
		calcModel(currentNode.upChild);
		calcModel(currentNode.downChild);
		currentNode.calcOptionPrices(q, R);
	}

	function calcQ(R, uParam, dParam) {
		return (R - dParam) / (uParam - dParam);
	}

	async function handleClick() {
		calcModel(currentNode);
		setCallPrice(model.Xc);
		setPutPrice(model.Xp);
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
					<Form.Label>u-Parameter</Form.Label>
					<InputGroup>
						<Form.Control
							value={uParam}
							onChange={(event) => {
								let newVal = event.target.value;
								setuParam(newVal);
								setQ(calcQ(R, newVal, dParam));
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
								setQ(calcQ(R, uParam, newVal));
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
								setQ(calcQ(newVal, uParam, dParam));
							}}
						/>
					</InputGroup>
				</Col>
				<Col>
					<Form.Label>Steps</Form.Label>
					<InputGroup>
						<Form.Control
							value={steps}
							onChange={(event) => {
								setSteps(event.target.value);
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
						onClick={async () => {
							model = new Node(null, S, 0);
							currentNode = model;
							await handleClick();
						}}
					>
						Calculate Model
					</Button>
				</Col>
			</Row>
			<p></p>
			<h1>Multi-Step Binomial Model Outputs</h1>
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
