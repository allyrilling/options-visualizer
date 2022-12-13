import './css/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import OptionVis from './components/OptionsVis.js';
import Navigation from './components/Navigation.js';
import Footer from './components/Footer.js';
import Home from './components/Home.js';
import BlackScholesPrices from './components/BlackScholesPrices.js';
import BlackScholesIV from './components/BlackScholesIV.js';
import BinModel from './components/BinModel.js';
import TVM from './components/TVM.js';

function App() {
	return (
		<div className='App' id='page-container'>
			{/* <OptionVis></OptionVis> */}
			<Router>
				<div id='content-wrap'>
					<Navigation />
					<Routes>
						<Route exact path='/' element={<Home />} />
						<Route exact path='/home' element={<Home />} />
						<Route exact path='/tvm' element={<TVM />} />
						<Route exact path='/options-visualizer' element={<OptionVis />} />
						<Route exact path='/binomial-model' element={<BinModel />} />
						{/* <Route exact path='/black-scholes-model' element={<BlackScholes />} /> */}
						<Route exact path='/bsm-prices' element={<BlackScholesPrices />} />
						<Route exact path='/bsm-implied-vol' element={<BlackScholesIV />} />
					</Routes>
				</div>
				<div id='footer'>
					<Footer />
				</div>
			</Router>
		</div>
	);
}

export default App;
