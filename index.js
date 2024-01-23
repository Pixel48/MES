import Dataset from './dataset.js';
import GL from './gaussLag.js';
import Hmatrix from './h.js';
import HBC from './hbc.js';

// console.debug = () => {};

const dataset = new Dataset('./.data/test2.txt');
// console.log(dataset); OK
// console.log(dataset.elements[0]); OK

const DEGREE = 3;

const gl = GL(DEGREE);
// console.debug(gl);
// console.log(gl); OK

const H_ = [];

const elementCount = dataset.elements.length;

for (let elementID = 0; elementID < elementCount; elementID++) {
  const element = dataset.elements[elementID];
  const { conductivity } = dataset;
  const H = new Hmatrix(element, DEGREE, conductivity);
  H_.push(H);
}

const Hbc_ = [];

H_.forEach((H, elementID) => {
  Hbc_.push(new HBC(dataset, elementID, DEGREE, gl));
});
console.debug(`Hbc_: ${[...Hbc_]}`);
