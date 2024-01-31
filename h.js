import GL from './gauss.js';
import ElementDv from './elementDv.js';
import Jacobian from './jacobian.js';
import ElementD from './elementD.js';
import HPC from './hpc.js';
import { printMatrix } from './index.js';

export default class H {
  constructor(element, degree, conductivity) {
    const gl = GL(degree);
    const pointCount = degree ** 2;

    this.pc = [];
    const tξ = [];
    const tη = [];
    for (let i = 0; i < degree; i++) {
      for (let j = 0; j < degree; j++) {
        tξ.push(gl.x[i]);
        tη.push(gl.x[j]);
      }
    }
    this.pc.push({ ξ: tξ, η: tη });

    const Ndivs = new ElementDv(tξ, tη);
    // console.dir({ Ndivs }, { depth: null });

    const { x, y } = element.nodes.reduce(
      (acc, node, nodeID) => {
        acc.x[nodeID] = node.x;
        acc.y[nodeID] = node.y;
        return acc;
      },
      { x: [], y: [] }
    );

    const Jpc = [];
    for (let point = 0; point < pointCount; point++) {
      Jpc.push(new Jacobian(Ndivs, x, y, point));
    }
    // console.dir({ Jpc }, { depth: null });

    const Nd = [];
    for (let point = 0; point < pointCount; point++) {
      Nd.push(new ElementD(Jpc, Ndivs));
    }

    const HPCpc = [];
    for (let point = 0; point < pointCount; point++) {
      // console.dir({ Jacobian: Jpc[point] }, { depth: null });
      // console.dir({ Nd: Nd[point] }, { depth: null });
      // console.debug({ point });
      // console.debug({ conductivity });
      HPCpc.push(new HPC(point, Nd[point], Jpc[point], conductivity));
      // console.debug('\t\t++ HPC MATRIX ++');
      // printMatrix(HPCpc[HPCpc.length - 1].result);
    }
    // console.dir({ HPCpc }, { depth: null });

    const Wpc = [];
    for (let i = 0; i < degree; i++) {
      for (let k = 0; k < degree; k++) {
        Wpc.push(gl.w[i] * gl.w[k]);
      }
    }
    // console.dir({ Wpc }, { depth: null });

    this.matrix = [];
    for (let point = 0; point < pointCount; point++)
      for (let row = 0; row < 4; row++)
        for (let col = 0; col < 4; col++) {
          this.matrix[row] ??= [];
          this.matrix[row][col] ??= 0;
          this.matrix[row][col] += Wpc[point] * HPCpc[point].result[row][col]; // * Jpc[point].detJ;
        }
    // console.dir({ H: this.matrix }, { depth: null });
    // console.debug('\t\t== H MATRIX ==');
    // printMatrix(this.matrix);
  }
}
