import GL from './gauss.js';
import ElementDv from './elementDv.js';
import Jacobian from './jacobian.js';
import CPC from './cpc.js';

export default class C {
  constructor(element, degree, conductivity, specyficHeat, density) {
    this.matrix = [];
    for (let _ = 0; _ < 4; _++) this.matrix.push([]);

    const Cpc_ = [];

    const gl = GL(degree);
    const pointCount = degree ** 2;

    const ξ = [];
    const η = [];
    for (let i = 0; i < degree; i++) {
      for (let j = 0; j < degree; j++) {
        ξ.push(gl.x[i]);
        η.push(gl.x[j]);
      }
    }
    const PC = { ξ: ξ, η: η };

    const Ndv = new ElementDv(ξ, η);
    // const { nodes } = dataset.elements[elementID];

    const nodeLine = element.nodes.reduce(
      (acc, node) => {
        acc.x.push(node.x);
        acc.y.push(node.y);
        return acc;
      },
      { x: [], y: [] }
    );

    const Jpc = [];
    for (let i = 0; i < pointCount; i++)
      Jpc.push(new Jacobian(Ndv, nodeLine.x, nodeLine.y, i));
    for (let i = 0; i < pointCount; i++)
      Cpc_.push(new CPC(i, PC, Jpc[i].detJ, specyficHeat, density, degree, gl));
    // console.dir({ Cpc_ }, { depth: null }); // OK

    const Wpc_ = [];
    for (let i = 0; i < degree; i++)
      for (let j = 0; j < degree; j++) {
        Wpc_.push(gl.w[i] * gl.w[j]);
      }

    // console.dir({ Wpc_ }, { depth: null });
    // console.dir({ Cpc_ }, { depth: null });
    for (let row = 0; row < 4; row++)
      for (let col = 0; col < 4; col++)
        for (let point = 0; point < pointCount; point++) {
          this.matrix[row][col] ??= 0;
          this.matrix[row][col] += Wpc_[point] * Cpc_[point].matrix[row][col];
        }
  }
}
