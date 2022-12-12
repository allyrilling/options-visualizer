var { jStat } = require('jstat');

export function NORMDIST(x, mean, sd, cumulative) {
	return cumulative ? jStat.normal.cdf(x, mean, sd) : jStat.normal.pdf(x, mean, sd);
}

export function calcD1(S, K, sigma, DY, R, T) {
	return (1 / (sigma * Math.sqrt(T))) * (Math.log(S / K) + (R - DY + 0.5 * sigma ** 2) * T);
}

export function calcD2(d1, sigma, T) {
	return d1 - sigma * Math.sqrt(T);
}

export function calcPVK(K, R, T) {
	return K * Math.E ** (-R * T);
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
	return [d1, d2].concat(Nds);
}

export function calcDriftTerm(sigma, R, DY, T) {
	// ! this might be incorrect
	return (R - DY + 0.5 * sigma ** 2) * T;
}

export function calcBSPrice(S, K, sigma, DY, R, T, isCall) {
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
