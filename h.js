import GL from './gaussLag.js';
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
    for (let pointID = 0; pointID < pointCount; pointID++) {
      Jpc.push(new Jacobian(Ndivs, x, y, pointID));
    }

    const Nd = [];
    for (let pointID = 0; pointID < pointCount; pointID++) {
      Nd.push(new ElementD(Jpc[pointID], Ndivs));
    }

    const HPCpc = [];
    for (let pointID = 0; pointID < pointCount; pointID++) {
      HPCpc.push(new HPC(pointID, Nd[pointID], Jpc[pointID], conductivity));
    }

    const Wpc = [];
    for (let i = 0; i < degree; i++) {
      for (let k = 0; k < degree; k++) {
        Wpc.push(gl.w[i] * gl.w[k]);
      }
    }

    this.matrix = [];
    for (let pointID = 0; pointID < 4; pointID++) {
      this.matrix.push([]);
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < pointCount; col++) {
          this.matrix[pointID][row] ??= 0;
          this.matrix[pointID][row] +=
            Wpc[col] * HPCpc[col].result[pointID][row];
        }
      }
    }
  }
}
