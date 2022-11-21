import React from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import ovlogo from '../images/ovLogo.png';
import Tool from './Tool.js';
import { useNavigate } from 'react-router-dom';
import '../css/App.css';

export default function Home() {
	const navigate = useNavigate();
	return (
		<Container>
			<Row>
				<Col onClick={() => navigate('/options-visualizer')}>
					<Tool name={'Option Visualizer'} icon={ovlogo} description='Create options spreads and see thier payoffs.'></Tool>
				</Col>
				<Col onClick={() => navigate('/binomial-model')}>
					<Tool name={'Binomial Model'} icon={ovlogo} description='Calulate option prices using the binomial model.'></Tool>
				</Col>
				<Col onClick={() => navigate('/black-scholes-model')}>
					<Tool name={'Black-Scholes Model'} icon={ovlogo} description='Calculate option prices using the Black-Scholes model.'></Tool>
				</Col>
			</Row>
		</Container>
	);
}
