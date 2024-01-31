import GL from './gauss.js';
import ElementDv from './elementDv.js';
import Jacobian from './jacobian.js';
import ElementD from './elementD.js';
import HPC from './hpc.js';

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

    const Nd = [];
    for (let point = 0; point < pointCount; point++) {
      Nd.push(new ElementD(Jpc[point], Ndivs));
    }

    const HPCpc = [];
    for (let point = 0; point < pointCount; point++) {
      HPCpc.push(new HPC(point, Nd[point], Jpc[point], conductivity));
    }

    const Wpc = [];
    for (let i = 0; i < degree; i++) {
      for (let k = 0; k < degree; k++) {
        Wpc.push(gl.w[i] * gl.w[k]);
      }
    }

    this.matrix = [];
    for (let point = 0; point < 4; point++) {
      this.matrix.push([]);
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < pointCount; col++) {
          this.matrix[point][row] ??= 0;
          this.matrix[point][row] += Wpc[col] * HPCpc[col].result[point][row];
        }
      }
    }
  }
}
