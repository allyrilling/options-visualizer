import './css/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import OptionVis from './components/OptionsVis.js';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './components/Home';
import BlackScholes from './components/BlackScholes';
import BinModel from './components/BinModel';
import TVM from './components/TVM';

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
						<Route exact path='/black-scholes-model' element={<BlackScholes />} />
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
