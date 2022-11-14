import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import OptionVis from './OptionsVis.js';
import Navigation from './Navigation';
import Footer from './Footer';
import Home from './Home';

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
						<Route exact path='/options-visualizer' element={<OptionVis />} />
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
