export default class Node {
	parent;
	spot;
	upChild;
	downChild;
	Xc;
	Xd;
	callPrice;
	putPrice;

	constructor(parent, spot) {
		this.parent = parent;
		this.spot = spot;
	}

	createChildren(u, d) {
		this.upChild = new Node(this, this.spot * u);
		this.downChild = new Node(this, this.spot * d);
	}

	calcPayoffs(strike) {
		this.Xc = Math.max(0, this.spot - strike);
		this.Xp = Math.max(0, strike - this.spot);
	}

	calcOptionPrices(q, r) {
		if (this.upChild !== null && this.downChild !== null) {
			// all steps but the last step
			this.callPrice = (1 / r) * (q * this.upChild.callPrice + (1 - q) * this.downChild.callPrice);
			this.putPrice = (1 / r) * (q * this.upChild.putPrice + (1 - q) * this.downChild.putPrice);
		} else if (
			this.upChild.callPrice === null &&
			this.downChild.callPrice === null &&
			this.upChild.putPrice === null &&
			this.downChild.putPrice === null
		) {
			// the last step where there are children, but no option prices
			this.callPrice = (1 / r) * (q * this.upChild.Xc + (1 - q) * this.downChild.Xc);
			this.putPrice = (1 / r) * (q * this.upChild.Xp + (1 - q) * this.downChild.Xp);
		}
	}
}
