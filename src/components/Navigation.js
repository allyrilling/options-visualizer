import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Nav, Navbar, Container, NavDropdown } from 'react-bootstrap';
import '../css/Navigation.css';
import ftlogo from '../images/ftLogo.png';

function Navigation(props) {
	const navigate = useNavigate();

	const tabs = {
		tvm: 'TVM Calculator',
		ff: 'Forwards / Futures',
		ov: 'Options Visualizer',
		bm: 'Binomial Model',
		bsm: 'Black-Scholes Model',
	};

	const bsmTabs = {
		prices: 'Prices and Greeks',
		iv: 'Implied Volatility',
	};

	const ovTabs = {
		ovCustom: 'Options Visualizer',
		ovStock: 'Spread Types',
	};

	return (
		<Navbar collapseOnSelect expand='sm'>
			<Container>
				<Navbar.Brand className='align-center' style={{ fontSize: '30px', fontWeight: 'bold', color: 'red' }} onClick={() => navigate('/home')}>
					<img src={ftlogo} className='navImg'></img>
				</Navbar.Brand>
				<Navbar.Toggle />
				<Navbar.Collapse id='responsive-navbar-nav'>
					<Nav className='ml-auto'>
						<Nav.Link className='linkHover' onClick={() => navigate('/tvm')}>
							{tabs.tvm}
						</Nav.Link>
						<Nav.Link className='linkHover' onClick={() => navigate('/forwards-futures')}>
							{tabs.ff}
						</Nav.Link>
						<Nav.Link onClick={() => navigate('/options-visualizer')}>{ovTabs.ovCustom}</Nav.Link>
						{/* <NavDropdown title={tabs.ov}>
							<NavDropdown.Item className='linkHover'>
								<Nav.Link onClick={() => navigate('/options-visualizer')}>{ovTabs.ovCustom}</Nav.Link>
							</NavDropdown.Item>
							<NavDropdown.Item className='linkHover'>
								<Nav.Link onClick={() => navigate('/spreads-viewer')}>{ovTabs.ovStock}</Nav.Link>
							</NavDropdown.Item>
						</NavDropdown> */}
						<Nav.Link className='linkHover' onClick={() => navigate('/binomial-model')}>
							{tabs.bm}
						</Nav.Link>
						{/* <Nav.Link className='linkHover' onClick={() => navigate('/black-scholes-model')}>
							{tabs.bsm}
						</Nav.Link> */}
						<NavDropdown title={tabs.bsm}>
							<NavDropdown.Item className='linkHover'>
								<Nav.Link onClick={() => navigate('/bsm-prices')}>{bsmTabs.prices}</Nav.Link>
							</NavDropdown.Item>
							<NavDropdown.Item className='linkHover'>
								<Nav.Link onClick={() => navigate('/bsm-implied-vol')}>{bsmTabs.iv}</Nav.Link>
							</NavDropdown.Item>
						</NavDropdown>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}

export default Navigation;
