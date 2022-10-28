import { Line } from 'react-chartjs-2';
import { useState } from 'react';
import React, { Component } from 'react';

export default class Chart extends Component {
	constructor(props) {
		super(props);
		this.state = {
			strikePrice: 0,
			optionPrice: 0,
		};
	}

	render() {
		return <div>Chart</div>;
	}
}
