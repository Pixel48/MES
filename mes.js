import Dataset from './dataset.js';
import GL from './gauss.js';
import Hmatrix from './h.js';
import HBC from './hbc.js';
import C from './c.js';
import GlobalH from './globalh.js';
import GlobalC from './globalc.js';
import Sim from './sim.js';
import path from 'path';

process.stdout.write('\x1Bc');

export const printMatrix = (matrix) => {
  matrix.forEach((row) => {
    console.log(row.reduce((acc, value) => `${acc}\t${value.toFixed(2)}`, ''));
  });
  console.debug();
};

export default class MES {
  constructor(datasetPath, display = false) {
    const dataset = new Dataset(datasetPath);
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
    // niceprint(H_[0].matrix);

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
    // globalH.matrix.forEach((row) => {
    //   console.log(row.reduce((acc, value) => `${acc}\t${value.toFixed(2)}`, ''));
    // });
    // console.dir(globalH.P, { depth: null });

    const globalC = new GlobalC(C_, dataset);
    // console.dir({ globalC }, { depth: null });
    // console.dir({ GEglobalH: elimination(globalH.matrix, globalH.P) });

    if (display) console.dir({ dataset }, { depth: null });

    this.sim = new Sim(dataset, globalH, globalC);
    // const TARGET = 5;
    // for (let target = 0; target < TARGET; target++) sim.step(false, true);
    // sim.run(false, true);
    // sim.save(`./vtk/${path.basename(datasetPath)}`);
    // sim.run();
  }

  bake(outputPath, logging = false) {
    this.sim.run(false, logging);
    this.sim.save(outputPath);
  }
}
