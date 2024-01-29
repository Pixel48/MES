export default class CPC {
  constructor(point, PC, detJ, specyficHeat, density, degree, gl) {
    // console.dir(PC, { depth: null });
    this.matrix = [];
    for (let _ = 0; _ < 4; _++)
      this.matrix.push([undefined, undefined, undefined, undefined]);

    // console.dir({ point, PC, detJ: J, dataset, degree, gl }, { depth: null });

    const N = this.quickCalcN(PC.ξ[point], PC.η[point]);
    for (let row = 0; row < 4; row++)
      for (let col = 0; col < 4; col++) {
        this.matrix[row][col] = specyficHeat * density * N[row] * N[col] * detJ;
        // console.dir(
        //   { specyficHeat, density, 'N[row]': N[row], 'N[col]': N[col], detJ },
        //   { depth: null }
        // );
      }
  }
  quickCalcN(ξ, η) {
    return [
      (1 - ξ) * (1 - η) * 0.25,
      (1 + ξ) * (1 - η) * 0.25,
      (1 + ξ) * (1 + η) * 0.25,
      (1 - ξ) * (1 + η) * 0.25,
    ];
  }
}
