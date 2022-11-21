import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import '../css/Tool.css';

export default function Tool(props) {
	return (
		<Col>
			<img src={props.icon} width='150px' className='shadowIcon'></img>
			<h3>{props.name}</h3>
			<p>{props.description}</p>
		</Col>
	);
}
