var { jStat } = require('jstat');

function NORMDIST(x, mean, sd, cumulative) {
	return cumulative ? jStat.normal.cdf(x, mean, sd) : jStat.normal.pdf(x, mean, sd);
}

function calcD1(S, K, sigma, DY, R, T) {
	return (1 / (sigma * Math.sqrt(T))) * (Math.log(S / K) + (R - DY + 0.5 * sigma ** 2) * T);
}

function calcD2(d1, sigma, T) {
	return d1 - sigma * Math.sqrt(T);
}

function calcPVK(K, R, T) {
	return K * Math.E ** (-R * T);
}

function calcBSPrice(S, K, sigma, DY, R, T, isCall) {
	let d1 = calcD1(S, K, sigma, DY, R, T);
	let d2 = calcD2(d1, sigma, T);
	let pvK = calcPVK(K, R, T);
	let Nd1 = NORMDIST(d1, 0, 1, true);
	let Nd2 = NORMDIST(d2, 0, 1, true);
	let negNd1 = 1 - Nd1;
	let negNd2 = 1 - Nd2;

	if (isCall) {
		let callPrice = S * Math.E ** (-DY * T) * Nd1 - pvK * Nd2;
		return callPrice;
	} else {
		let putPrice = pvK * negNd2 - S * Math.E ** (-DY * T) * negNd1;
		return putPrice;
	}
}

function inflectionPoint(S, K, T, R) {
	let x = S / (K * Math.E ** (-R * T));
	return Math.sqrt((2 * Math.abs(Math.log(x))) / T);
}

function vega(S, sigma, K, T, R, DY) {
	let d1 = (1 / (sigma * Math.sqrt(T))) * (Math.log(S / K) + (R - DY + 0.5 * sigma ** 2) * T);
	let vega = S * T ** 0.5 * NORMDIST(d1, 0, 1, false);
	return vega;
}

export function calcImpliedVol(C, S, K, R, DY, T, isCall) {
	let x0 = inflectionPoint(S, K, T, R);
	let bsPrice = calcBSPrice(S, K, x0, DY, R, T, isCall);
	let v = vega(S, x0, K, T, R, DY);
	while (Math.abs((bsPrice - C) / v) > tolerance) {
		x0 = x0 - (bsPrice - C) / v;
		bsPrice = calcBSPrice(S, K, x0, DY, R, T, isCall);
		v = vega(S, x0, K, T, R, DY);
	}
	return x0;
}

let tolerance = 10 ** -8;
