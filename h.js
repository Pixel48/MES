import GL from './gaussLag.js';
import ElementDivs from './elementDivs.js';
import Jacobian from './jacobian.js';
import ElementD from './elementD.js';
import HPC from './hpc.js';

export default class H {
  constructor(element, degree, conductivity) {
    this.degree = degree;
    this.gl = GL(this.degree);
    const pointCount = degree ** 2;

    this.pc = [];
    const tξ = [];
    const tη = [];
    for (let i = 0; i < this.degree; i++) {
      for (let j = 0; j < this.degree; j++) {
        tξ.push(this.gl.x[i]);
        tη.push(this.gl.x[j]);
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
    // console.log(Jpc[0]);

    const Nd = [];
    // console.log({ Ndivs });
    for (let pointID = 0; pointID < pointCount; pointID++) {
      Nd.push(new ElementD(Jpc[pointID], Ndivs));
    }
    // console.log(Jpc[0]);
    // console.log(Ndivs);
    // console.log(Nd[0]);

    const HPCpc = [];
    for (let pointID = 0; pointID < pointCount; pointID++) {
      HPCpc.push(new HPC(pointID, Nd[pointID], Jpc[pointID], conductivity));
    }
    console.log(Nd[0]);
    console.log(HPCpc[0]);
  }
}
