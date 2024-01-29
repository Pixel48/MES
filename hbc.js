export default class HBC {
  constructor(dataset, elementID, degree, gl) {
    const element = dataset.elements[elementID];

    const { alpha: alpha, tot } = dataset;

    this.P = [];
    this.matrix = [];
    for (let row = 0; row < 4; row++) {
      this.matrix.push([]);
      this.P.push(0);
      for (let col = 0; col < 4; col++) {
        this.matrix[row].push(0);
        for (let depth = 0; depth < 4; depth++) {}
      }
    }

    const ξηPair = (edge, tillDeg) => {
      const glx = gl.x[tillDeg];
      const I = !(edge % 3) ? -1 : 1;
      const result = [glx, I];
      return !(edge % 2) ? result : result.reverse();
    };

    const edgeInfo = []; // edgeInfo[edgeID][i2degree][ξ,η]
    for (let edge = 0; edge < 4; edge++) {
      edgeInfo.push([]); // edge axis
      for (let k = 0; k < degree; k++) {
        edgeInfo[edge].push(ξηPair(edge, k));
      }
    }

    for (let edge = 0; edge < 4; edge++) {
      const nodeA = element.nodes[edge];
      const nodeB = element.nodes[(edge + 1) % 4];
      if (!(nodeA.bc && nodeB.bc)) continue;
      const detJ =
        ((nodeA.x - nodeB.x) ** 2 + (nodeA.y - nodeB.y) ** 2) ** 0.5 / 2;

      for (let k = 0; k < degree; k++) {
        const N = [];
        for (let x = 0; x < 4; x++) {
          const first = edgeInfo[edge][k][0] * (!!(x % 3) ? -1 : 1);
          const second = edgeInfo[edge][k][1] * (x < 2 ? -1 : 1);
          N[x] = 0.25 * (1 + first) * (1 + second);
        } // build N
        // console.debug('N:', N);

        for (let i = 0; i < 4; i++) {
          this.P[i] += N[i] * tot * detJ * gl.w[k] * alpha;
          if (isNaN(this.P[i])) {
            console.error({
              where: `P[${i}]`,
              i,
              Ni: N[i],
              tot,
              detJ,
              glw: gl.w[k],
              alpha,
            });
            throw new Error('NaN in P');
          }

          for (let j = 0; j < 4; j++)
            this.matrix[i][j] += N[i] * N[j] * detJ * gl.w[k] * alpha;
        }
      }
    }
  }
}
