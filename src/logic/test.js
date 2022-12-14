// import * as bsl from '../logic/BlackScholesLib';
import * as bsl from '../logic/BlackScholesLib.js';

// let S = 100;
// let K = 110;
// let T = 30 / 365;
// let R = 0.02;
// let DY = 0.01;
// let sigma = 0.25;

let S = 60;
let K = 50;
let T = 0.5;
let R = 0.0025;
let DY = 0;
let sigma = 0.5;

console.log('option price', bsl.calcBSPrice(S, K, sigma, DY, R, T, true));
console.log('delta Δ', bsl.delta(S, sigma, K, T, R, DY, true)); // * correct
console.log('gamma Γ', bsl.gamma(S, sigma, K, T, R, DY)); // * correct
console.log('vega 𝑣', bsl.vega(S, sigma, K, T, R, DY)); // * correct
console.log('theta Θ', bsl.theta(S, sigma, K, T, R, DY, true)); // * correct
console.log('rho ρ', bsl.rho(S, sigma, K, T, R, DY, true)); // * correct
