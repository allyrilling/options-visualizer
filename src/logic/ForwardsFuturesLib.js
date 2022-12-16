export function calcFuturesPayoff(F, Ft, n, N, isLong) {
	if (isLong) {
		return (Ft - F) * n * N;
	} else {
		return (F - Ft) * n * N;
	}
}

// M is holding benefit
export function calcAFP(S, M, R, T) {
	return (S + M) * Math.exp(R * T);
}

export function calcPVK(K, R, T) {
	return K * Math.E ** (-R * T);
}

export function calcNetHoldingCosts(cost, benefit, R, T) {
	return calcPVK(cost, R, T) - calcPVK(benefit, R, T);
}

export function calcAFForexRate(S, R, D, T) {
	return S * Math.exp((R - D) * T);
}
