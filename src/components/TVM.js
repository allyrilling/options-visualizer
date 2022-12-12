import React from 'react';
import { Col, Container, Row, Form, InputGroup, ButtonGroup, Button } from 'react-bootstrap';
import { useState } from 'react';

export default function TVM() {
	const [PV, setPV] = useState(10);
	const [FV, setFV] = useState(10);
	const [PMT, setPMT] = useState(1);
	const [R, setR] = useState(1);
	const [T, setT] = useState(1);

	const fields = {
		pv: 'Present Value',
		fv: 'Future Value',
		pmt: 'Payment',
		r: 'Interest Rate',
		t: 'Time',
	};
	const [selected, setSelected] = useState(fields.pv);

	function doCalc(selected, pv, fv, pmt, r, t) {
		if (selected === fields.pv) {
			setPV(calcPV(fv, pmt, r, t));
		} else if (selected === fields.fv) {
			setFV(calcFV(fv, pmt, r, t));
		} else if (selected === fields.pmt) {
			setPMT(calcPMT(fv, pv, r, t));
		} else if (selected === fields.r) {
			setR(calcR(fv, pv, pmt, t));
		} else if (selected === fields.t) {
			setT(calcT(fv, pv, pmt, r));
		}
	}

	function calcPV(fv, pmt, r, t) {
		r = r / 100;
		let pvFV = fv / (1 + r) ** t;
		let pvPMT = 0;
		for (let i = 0; i < t; i++) {
			pvPMT += pmt / (1 + r) ** i;
		}
		return pvFV + pvPMT;
	}

	function calcFV(pv, pmt, r, t) {
		r = r / 100;
		let fvPV = pv * (1 + r) ** t;
		let fvPMT = 0;
		for (let i = 0; i < t; i++) {
			//for (let i = t; i > 0; i--) {
			fvPMT += pmt * (1 + r) ** i;
		}
		return fvPV + fvPMT;
	}

	function calcPMT(fv, pv, r, t) {}
	function calcR(fv, pv, pmt, t) {}
	function calcT(fv, pv, pmt, r) {}

	return (
		<Container>
			<p></p>
			<h1>Time Value of Money</h1>
			<Row>
				<Form.Label>Field to Calculate</Form.Label>
				<ButtonGroup>
					<Button
						variant={selected === fields.pv ? 'danger' : 'secondary'}
						onClick={() => {
							setSelected(fields.pv);
							doCalc(fields.pv, PV, FV, PMT, R, T);
						}}
					>
						{fields.pv}
					</Button>
					<Button
						variant={selected === fields.fv ? 'danger' : 'secondary'}
						onClick={() => {
							setSelected(fields.fv);
							doCalc(fields.fv, PV, FV, PMT, R, T);
						}}
					>
						{fields.fv}
					</Button>
					<Button
						variant={selected === fields.pmt ? 'danger' : 'secondary'}
						onClick={() => {
							setSelected(fields.pmt);
							doCalc(fields.pmt, PV, FV, PMT, R, T);
						}}
					>
						{fields.pmt}
					</Button>
					<Button
						variant={selected === fields.r ? 'danger' : 'secondary'}
						onClick={() => {
							setSelected(fields.r);
							doCalc(fields.r, PV, FV, PMT, R, T);
						}}
					>
						{fields.r}
					</Button>
					<Button
						variant={selected === fields.t ? 'danger' : 'secondary'}
						onClick={() => {
							setSelected(fields.t);
							doCalc(fields.t, PV, FV, PMT, R, T);
						}}
					>
						{fields.t}
					</Button>
				</ButtonGroup>
			</Row>
			<p></p>
			<Row>
				<Col>
					<Form.Label>Present Value</Form.Label>
					<InputGroup>
						<InputGroup.Text>$</InputGroup.Text>
						<Form.Control
							value={PV}
							onChange={(event) => {
								let newVal = event.target.value;
								setPV(newVal);
								doCalc(selected, newVal, FV, PMT, R, T);
							}}
							disabled={selected === fields.pv}
						/>
					</InputGroup>
				</Col>
				<Col>
					<Form.Label>Future Value</Form.Label>
					<InputGroup>
						<InputGroup.Text>$</InputGroup.Text>
						<Form.Control
							value={FV}
							onChange={(event) => {
								let newVal = event.target.value;
								setFV(newVal);
								doCalc(selected, PV, newVal, PMT, R, T);
							}}
							disabled={selected === fields.fv}
						/>
					</InputGroup>
				</Col>
				<Col>
					<Form.Label>Payment</Form.Label>
					<InputGroup>
						<InputGroup.Text>$</InputGroup.Text>
						<Form.Control
							value={PMT}
							onChange={(event) => {
								let newVal = event.target.value;
								setPMT(newVal);
								doCalc(selected, PV, FV, newVal, R, T);
							}}
							disabled={selected === fields.pmt}
						/>
					</InputGroup>
				</Col>
				<Col>
					<Form.Label>Rate</Form.Label>
					<InputGroup>
						<Form.Control
							value={R}
							onChange={(event) => {
								let newVal = event.target.value;
								setR(newVal);
								doCalc(selected, PV, FV, PMT, newVal, T);
							}}
							disabled={selected === fields.r}
						/>
						<InputGroup.Text>%</InputGroup.Text>
					</InputGroup>
				</Col>
				<Col>
					<Form.Label>Time (Years)</Form.Label>
					<InputGroup>
						<Form.Control
							value={T}
							onChange={(event) => {
								let newVal = event.target.value;
								setT(newVal);
								doCalc(selected, PV, FV, PMT, R, newVal);
							}}
							disabled={selected === fields.t}
						/>
						<InputGroup.Text>years</InputGroup.Text>
					</InputGroup>
				</Col>
			</Row>
		</Container>
	);
}
