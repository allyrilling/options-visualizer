import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Nav, Navbar, Container } from 'react-bootstrap';
import '../css/Navigation.css';
import ftlogo from '../images/ftLogo.png';

function Navigation(props) {
	const navigate = useNavigate();
	return (
		<Navbar collapseOnSelect expand='sm'>
			<Container>
				<Navbar.Brand className='align-center' style={{ fontSize: '30px', fontWeight: 'bold', color: 'red' }} onClick={() => navigate('/home')}>
					<img src={ftlogo} className='navImg'></img>
				</Navbar.Brand>
				<Navbar.Toggle aria-controls='responsive-navbar-nav' />
				<Navbar.Collapse id='responsive-navbar-nav'>
					<Nav className='ml-auto'>
						<Nav.Link className='linkHover' onClick={() => navigate('/options-visualizer')}>
							Options Visualizer
						</Nav.Link>
						<Nav.Link className='linkHover' onClick={() => navigate('/binomial-model')}>
							Binomial Model
						</Nav.Link>
						<Nav.Link className='linkHover' onClick={() => navigate('/black-scholes-model')}>
							Black-Scholes Model
						</Nav.Link>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}

export default Navigation;
