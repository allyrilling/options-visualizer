import React, { useState } from 'react';
import { Col, Row, Container, Form, InputGroup } from 'react-bootstrap';
import * as ovl from '../logic/OptionVisLib.js';

export default function OVInput(props) {
	const [qty, setQty] = useState(props.q);
	const [position, setPosition] = useState(props.pos);
	const [flavor, setFlavor] = useState(props.flav);
	const [strikePrice, setStrikePrice] = useState(props.k);
	const [optionPrice, setOptionPrice] = useState(props.op);

	return (
		<Container>
			<Row>
				<Col>
					<Form.Label>Quantity</Form.Label>
					<InputGroup>
						<InputGroup.Text>#</InputGroup.Text>
						<Form.Control
							id='strikePrice'
							placeholder={qty}
							onChange={(event) => {
								setQty(event.target.value);
								props.callback(event.target.value, position, flavor, strikePrice, optionPrice);
							}}
						/>
					</InputGroup>
				</Col>
				<Col>
					<Form.Label>Position</Form.Label>
					<Form.Select
						placeholder={position}
						onChange={(event) => {
							setPosition(event.target.value);
							props.callback(qty, event.target.value, flavor, strikePrice, optionPrice);
						}}
					>
						<option>{ovl.positions.Long}</option>
						<option>{ovl.positions.Short}</option>
					</Form.Select>
				</Col>
				<Col>
					<Form.Label>Flavor</Form.Label>
					<Form.Select
						placeholder={flavor}
						onChange={(event) => {
							setFlavor(event.target.value);
							props.callback(qty, position, event.target.value, strikePrice, optionPrice);
						}}
					>
						<option>{ovl.flavors.Call}</option>
						<option>{ovl.flavors.Put}</option>
					</Form.Select>
				</Col>
				<Col>
					<Form.Label>Strike Price</Form.Label>
					<InputGroup>
						<InputGroup.Text>$</InputGroup.Text>
						<Form.Control
							id='strikePrice'
							placeholder={strikePrice}
							onChange={(event) => {
								setStrikePrice(event.target.value);
								props.callback(qty, position, flavor, event.target.value, optionPrice);
							}}
						/>
					</InputGroup>
				</Col>
				<Col>
					<Form.Label>Option Price</Form.Label>
					<InputGroup>
						<InputGroup.Text>$</InputGroup.Text>
						<Form.Control
							id='optionPrice'
							placeholder={optionPrice}
							onChange={(event) => {
								setOptionPrice(event.target.value);
								props.callback(qty, position, flavor, strikePrice, event.target.value);
							}}
						/>
					</InputGroup>
				</Col>
			</Row>
		</Container>
	);
}
