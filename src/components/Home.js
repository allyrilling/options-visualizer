import React from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import ovlogo from '../images/ovLogo.png';
import bmlogo from '../images/bmLogo.png';
import bslogo from '../images/bsLogo.png';
import Tool from './Tool.js';
import { useNavigate } from 'react-router-dom';
import '../css/Home.css';

export default function Home() {
	const navigate = useNavigate();
	return (
		<Container>
			<Row className='containerHome'>
				<Col onClick={() => navigate('/options-visualizer')}>
					<Tool name={'Option Visualizer'} icon={ovlogo} description='Create options spreads and see thier payoffs.'></Tool>
				</Col>
				<Col onClick={() => navigate('/binomial-model')}>
					<Tool name={'Binomial Model'} icon={bmlogo} description='Calulate option prices using the binomial model.'></Tool>
				</Col>
				<Col onClick={() => navigate('/bsm-prices')}>
					<Tool name={'Black-Scholes Model'} icon={bslogo} description='Calculate option prices using the Black-Scholes model.'></Tool>
				</Col>
			</Row>
		</Container>
	);
}
