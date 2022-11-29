class Node {
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

		// if (
		// 	this.upChild.callPrice === undefined &&
		// 	this.downChild.callPrice === undefined &&
		// 	this.upChild.putPrice === undefined &&
		// 	this.downChild.putPrice === undefined
		// ) {
		// 	// the last step where there are children, but no option prices
		// 	this.callPrice = (1 / r) * (q * this.upChild.Xc + (1 - q) * this.downChild.Xc);
		// 	this.putPrice = (1 / r) * (q * this.upChild.Xp + (1 - q) * this.downChild.Xp);
		// } else if (this.upChild !== undefined && this.downChild !== undefined) {
		// 	// all steps but the last step
		// 	this.callPrice = (1 / r) * (q * this.upChild.callPrice + (1 - q) * this.downChild.callPrice);
		// 	this.putPrice = (1 / r) * (q * this.upChild.putPrice + (1 - q) * this.downChild.putPrice);
		// } else {
		// 	console.log('error');
		// }
	}
}

let S = 325;
let K = 325;
let uParam = 1.0725;
let dParam = 0.9275;
let R = 1.025;
let steps = 3;
let q = (R - dParam) / (uParam - dParam);

// recursive function to generate tree
function calcModel(currentNode) {
	// base case
	if (currentNode.level === steps) {
		// dont create children
		currentNode.calcPayoffs(K);
		return;
	}
	currentNode.createChildren(uParam, dParam);
	calcModel(currentNode.upChild);
	calcModel(currentNode.downChild);
	currentNode.calcOptionPrices(q, R);
	// return;
}

let model = new Node(null, S, 0);
let currentNode = model;
calcModel(currentNode);

// console.log(model.downChild.downChild.Xp);

// console.log(model.Xc);
// console.log(model.Xp);
