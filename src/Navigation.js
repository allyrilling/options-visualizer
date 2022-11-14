import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Nav, Navbar, Container } from 'react-bootstrap';

function Navigation(props) {
	const navigate = useNavigate();
	return (
		<Navbar collapseOnSelect expand='sm' bg='#242424' variant='dark'>
			<Container>
				<Navbar.Brand className='align-center' style={{ fontSize: '30px', fontWeight: 'bold' }} onClick={() => navigate('/home')}>
					FinTools
				</Navbar.Brand>
				<Navbar.Toggle aria-controls='responsive-navbar-nav' />
				<Navbar.Collapse id='responsive-navbar-nav'>
					<Nav className='ml-auto'>
						<Nav.Link className='linkHover' onClick={() => navigate('/options-visualizer')}>
							Options Visualizer
						</Nav.Link>
						<Nav.Link className='linkHover'>Binomial Model</Nav.Link>
						<Nav.Link className='linkHover'>Black-Scholes Model</Nav.Link>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}

export default Navigation;
