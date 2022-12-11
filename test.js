var { jStat } = require('jstat');

function NORMDIST(x, mean, sd, cumulative) {
	return cumulative ? jStat.normal.cdf(x, mean, sd) : jStat.normal.pdf(x, mean, sd);
}

function calcCallPrice(S, K, sigma, DY, R, T) {
	let d1 = (1 / (sigma * Math.sqrt(T))) * (Math.log(S / K) + (R - DY + 0.5 * sigma ** 2) * T);
	let d2 = d1 - sigma * Math.sqrt(T);
	let pvK = K * Math.E ** (-R * T);
	let Nd1 = NORMDIST(d1, 0, 1, true);
	let Nd2 = NORMDIST(d2, 0, 1, true);

	let callPrice = S * Math.E ** (-DY * T) * Nd1 - pvK * Nd2;
	return callPrice;
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

function calcImpliedVolCall(C, S, K, R, DY, T, tolerance) {
	let x0 = inflectionPoint(S, K, T, R);
	let p = calcCallPrice(S, K, x0, DY, T, R);
	let v = vega(S, x0, K, T, R, DY);
	while (Math.abs((p - C) / v) > tolerance) {
		x0 = x0 - (p - C) / v;
		p = calcCallPrice(S, K, x0, DY, T, R);
		v = vega(S, x0, K, T, R, DY);
	}
	return x0;
}

let S = 100;
let K = 110;
let T = 1;
let R = 0.02;
let sigma = 0.2;
let DY = 0;

// todo i cant figure out why these two are not producing the same number
// ! shouldnt they both be the current real world price of the option?
let C = 4.943866957230476; //calcCallPrice(S, K, sigma, DY, T, R);
console.log(C);

let tol = 10 ** -8;

let iv = calcImpliedVolCall(C, S, K, R, DY, T, tol);
console.log(iv);
