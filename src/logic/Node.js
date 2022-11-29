export default class Node {
	parent;
	spot;
	upChild;
	downChild;
	Xc;
	Xp;
	level;

	constructor(parent, spot, level) {
		this.parent = parent;
		this.spot = spot;
		this.level = level;
	}

	createChildren(u, d) {
		this.upChild = new Node(this, this.spot * u, this.level + 1);
		this.downChild = new Node(this, this.spot * d, this.level + 1);
		// console.log(this.downChild.spot);
	}

	calcPayoffs(strike) {
		this.Xc = Math.max(0, this.spot - strike);
		this.Xp = Math.max(0, strike - this.spot);
	}

	calcOptionPrices(q, r) {
		this.Xc = (1 / r) * (q * this.upChild.Xc + (1 - q) * this.downChild.Xc);
		this.Xp = (1 / r) * (q * this.upChild.Xp + (1 - q) * this.downChild.Xp);
	}
}
