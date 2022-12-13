// import * as bsl from '../logic/BlackScholesLib';
import { delta } from '../logic/BlackScholesLib.js';

let S = 100;
let K = 110;
let T = 30 / 365;
let R = 0.02;
let DY = 0.01;
let sigma = 0.25;

console.log(delta(S, sigma, K, T, R, DY, true));
