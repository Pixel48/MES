import GL from './gaussLag.js';
import ElementDivs from './elementDivs.js';
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

    const Ndivs = new ElementDivs(tξ, tη);

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
    // console.debug(Jpc[0]);

    const Nd = [];
    // console.debug({ Ndivs });
    for (let pointID = 0; pointID < pointCount; pointID++) {
      Nd.push(new ElementD(Jpc[pointID], Ndivs));
    }
    // console.debug(Jpc[0]);
    // console.debug(Ndivs);
    // console.debug(Nd[0]);

    const HPCpc = [];
    for (let pointID = 0; pointID < pointCount; pointID++) {
      HPCpc.push(new HPC(pointID, Nd[pointID], Jpc[pointID], conductivity));
    }
    // console.debug(Nd[0]);
    // console.debug(HPCpc[0]);

    const Wpc = [];
    for (let i = 0; i < degree; i++) {
      for (let k = 0; k < degree; k++) {
        Wpc.push(gl.w[i] * gl.w[k]);
      }
    }
    // console.debug(gl);
    // console.debug(Wpc);

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
    // console.debug(HPCpc[0]);
    // console.debug({ H: this.matrix });
  }
}
