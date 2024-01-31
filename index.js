import Dataset from './dataset.js';
import GL from './gauss.js';
import Hmatrix from './h.js';
import HBC from './hbc.js';
import C from './c.js';
import GlobalH from './globalh.js';
import GlobalC from './globalc.js';
import { elimination } from './gauss.js';

const dataset = new Dataset('./.data/test2.txt');
// console.dir(dataset, { depth: null });

const DEGREE = 2;

const gl = GL(DEGREE);

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

// console.dir(Hbc_, { depth: null });

const C_ = [];
for (let i = 0; i < H_.length; i++) {
  C_.push(
    new C(
      dataset.elements[i],
      DEGREE,
      dataset.conductivity,
      dataset.specificHeat,
      dataset.density
    )
  );
}

// console.dir(C_, { depth: null });

const globalH = new GlobalH(H_, Hbc_, dataset);
// console.dir({ globalH }, { depth: null });

const globalC = new GlobalC(C_, dataset);
// console.dir({ globalC }, { depth: null });
console.dir({ GEglobalH: elimination(globalH.matrix, globalH.P) });
