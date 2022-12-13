import React from 'react';
import { Container, ButtonGroup, Button } from 'react-bootstrap';
import { useState } from 'react';
import '../css/BinModel.css';
import MultiStepBinModel from './MultiStepBinModel.js';
import SingleStepBinModel from './SingleStepBinModel.js';

export default function BinModel() {
	const modelTypes = {
		single: 'Single-Step Binomial Model',
		multi: 'Multi-Step Binomial Model',
	};
	const [modelType, setModelType] = useState(modelTypes.single);

	return (
		<Container className='container'>
			<ButtonGroup>
				<Button variant={modelType === modelTypes.single ? 'danger' : 'secondary'} onClick={() => setModelType(modelTypes.single)}>
					{modelTypes.single}
				</Button>
				<Button variant={modelType === modelTypes.multi ? 'danger' : 'secondary'} onClick={() => setModelType(modelTypes.multi)}>
					{modelTypes.multi}
				</Button>
			</ButtonGroup>
			{modelType === modelTypes.single ? <SingleStepBinModel /> : <MultiStepBinModel />}
		</Container>
	);
}
