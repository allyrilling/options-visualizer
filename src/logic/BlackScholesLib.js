// var { jStat } = require('jstat');
import pkg from 'jstat';
const { jStat } = pkg;

// *****************************************
// * Stats
// *****************************************

export function NORMDIST(x, mean, sd, cumulative) {
	return cumulative ? jStat.normal.cdf(x, mean, sd) : jStat.normal.pdf(x, mean, sd);
	// return (1 / Math.sqrt(2 * Math.PI * sd)) * Math.exp(-((x - mean) ** 2) / (2 * sd ** 2));
}

// todo add normdist prime
// export function NORMDIST_PRIME(x) {
// 	// return (1 / Math.sqrt(2 * Math.PI)) * Math.E ** (-0.5 * x ** 2);
// 	return (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x ** 2);
// }

// *****************************************
// * Ds
// *****************************************

export function calcD1(S, K, sigma, DY, R, T) {
	return (1 / (sigma * Math.sqrt(T))) * (Math.log(S / K) + (R - DY + 0.5 * sigma ** 2) * T);
}

export function calcD2(d1, sigma, T) {
	return d1 - sigma * Math.sqrt(T);
}

export function calcNds(d1, d2) {
	let Nd1 = NORMDIST(d1, 0, 1, true);
	let Nd2 = NORMDIST(d2, 0, 1, true);
	let negNd1 = 1 - Nd1;
	let negNd2 = 1 - Nd2;
	return [Nd1, Nd2, negNd1, negNd2];
}

export function calcDs(S, K, sigma, DY, R, T) {
	let d1 = calcD1(S, K, sigma, DY, R, T);
	let d2 = calcD2(d1, sigma, T);
	let Nds = calcNds(d1, d2);
	return [d1, d2].concat(Nds); // [d1, d2, N(d1), N(d2), N(-d1), N(-d2)]
}

// *****************************************
// * PVs
// *****************************************

export function calcPVK(K, R, T) {
	return K * Math.E ** (-R * T);
}

export function calcPVS(S, DY, T) {
	return S * Math.E ** (-DY * T);
}

// *****************************************
// * Other Calcs
// *****************************************

export function calcDriftTerm(sigma, R, DY, T) {
	return (R - DY + 0.5 * sigma ** 2) * T;
}

export function calcSpecialK(S, sigma, R, DY, T) {
	return S * Math.exp((R - DY + 0.5 * sigma ** 2) * T);
}

// *****************************************
// * Black Scholes Price Calc
// *****************************************

export function calcBSPrice(S, K, sigma, DY, R, T, isCall) {
	let ds = calcDs(S, K, sigma, DY, R, T);
	let pvK = calcPVK(K, R, T);
	let pvS = calcPVS(S, DY, T);

	if (isCall) {
		let callPrice = pvS * ds[2] - pvK * ds[3];
		return callPrice;
	} else {
		let putPrice = pvK * ds[5] - pvS * ds[4];
		return putPrice;
	}
}

// *****************************************
// * Implied Vol Calcs
// *****************************************

function inflectionPoint(S, K, T, R) {
	let x = S / (K * Math.E ** (-R * T));
	return Math.sqrt((2 * Math.abs(Math.log(x))) / T);
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

const tolerance = 10 ** -8;

// *****************************************
// * Greeks
// *****************************************

// ! units: $ inc in option value per 100% change in vol
export function vega(S, sigma, K, T, R, DY) {
	let d1 = calcD1(S, K, sigma, DY, R, T);
	let vega = S * T ** 0.5 * NORMDIST(d1, 0, 1, false); // * cents change per 1% increase in sigma
	return vega;
}

export function delta(S, sigma, K, T, R, DY, isCall) {
	let ds = calcDs(S, K, sigma, DY, R, T);
	if (isCall) {
		return ds[2]; // N(d1)
	} else {
		return -ds[4]; // -N(-d1)
	}
}

// ! units: $ per year, so should divide by 252 [make note of this] to get units as $ per day
export function theta(S, sigma, K, T, R, DY, isCall) {
	let ds = calcDs(S, K, sigma, DY, R, T);
	let xTerm = (-(S * sigma) * NORMDIST(ds[0], 0, 1, false)) / (2 * Math.sqrt(T)); // N'(d1) and N'(-d1)
	if (isCall) {
		return (xTerm - R * calcPVK(K, R, T) * ds[3]) / 252;
	} else {
		return (xTerm + R * calcPVK(K, R, T) * ds[5]) / 252;
	}
}

export function rho(S, sigma, K, T, R, DY, isCall) {
	let ds = calcDs(S, K, sigma, DY, R, T);
	if (isCall) {
		return calcPVK(K, R, T) * ds[3] * T; // * cents change per 1% increase in int rate
	} else {
		return -calcPVK(K, R, T) * ds[5] * T; // * cents change per 1% increase in int rate
	}
}

export function gamma(S, sigma, K, T, R, DY) {
	let ds = calcDs(S, K, sigma, DY, R, T);
	// return NORMDIST_PRIME(ds[0]) / (sigma * S * Math.sqrt(T));
	// derivative of normdist is just the non cumulative version of normdist
	return NORMDIST(ds[0], 0, 1, false) / (sigma * S * Math.sqrt(T));
}
