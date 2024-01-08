import Dataset from './dataset.js';
import GL from './gaussLag.js';
import Hmatrix from './h.js';

const DEGREE = 2;

const dataset = new Dataset('./.data/test2.txt');
// console.log(dataset); OK
// console.log(dataset.elements[0]); OK

const gl = GL(DEGREE);
// console.log(gl); OK

const Hs_ = [];
for (let elementID = 0; elementID < dataset.elements.length; elementID++) {
  const element = dataset.elements[elementID];
  const { conductivity } = dataset;
  const H = new Hmatrix(element, DEGREE, conductivity);
  Hs_.push(H);
}