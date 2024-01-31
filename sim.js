import { elimination as gaussianElimination } from './gauss.js';

export default class Sim {
  constructor(dataset, H, C) {
    this.dataset = dataset;
    this.globalH = H;
    this.globalC = C;

    this._step = 0;
    this.endStep = dataset.simTime;
    this.stepTime = dataset.simStepTime;
    this.totalTime = this.endStep * this.stepTime;

    this.steps = [[]];
    const { initialTemp } = dataset;
    for (let _ = 0; _ < this.globalH.matrix.length; _++)
      this.steps[0].push(initialTemp);
    // console.dir({ t0: this.t0 }, { depth: null });
  }
  step(output = false, border = false) {
    /* #region logging */
    if (this._step == 0) {
      if (output) console.log(this.steps[this._step]);
      if (border) console.log(this.minMax(this.steps[this._step]));
    }
    /* #endregion */
    this._step++;

    const HC = this.matrixSum(this.globalH.matrix, this.globalC.matrix);
    const C = this.matrixVectorProduct(
      this.globalC.matrix,
      this.steps[this._step - 1]
    );
    const P = this.vectorSum(
      this.globalH.P, //.map((value) => -value),
      C
    );

    // console.debug(`=== SIMULATION STEP (${this._step} / ${this.endStep}) ===`);
    // console.dir({ /*HC,*/ P }, { depth: null });

    this.steps[this._step] = gaussianElimination(HC, P);

    /* #region logging */
    if (output) console.log(this.steps[this._step]);
    if (border)
      console.log({
        step: this._step,
        minMax: this.minMax(this.steps[this._step]),
      });
    /* #endregion */
  }
  run(output = false, border = false) {
    if (output) console.debug('=== SIMULATION START ===');
    while (this._step < this.endStep) this.step(output, border);
  }
  matrixSum(matrix1, matrix2) {
    /* #region safeguard */
    if (
      matrix1.length != matrix2.length ||
      matrix1[0].length != matrix2[0].length
    )
      throw new Error('Matrix and vector must have the same dimensions');
    /* #endregion */
    const { length } = matrix1;
    const result = [];
    for (let row = 0; row < length; row++)
      for (let col = 0; col < length; col++) {
        result[row] ??= [];
        result[row][col] = matrix1[row][col] + matrix2[row][col];
      }
    return result;
  }
  matrixVectorProduct(matrix, vector) {
    if (matrix.length != vector.length)
      throw new Error('Matrix and vector must have the same length');
    const { length } = matrix;
    const result = [];
    for (let row = 0; row < length; row++)
      for (let col = 0; col < length; col++) {
        result[row] ??= 0;
        result[row] += matrix[row][col] * vector[col];
      }
    return result;
  }
  vectorSum(vector1, vector2) {
    if (vector1.length != vector2.length)
      throw new Error('Vector and vector must have the same length');
    const { length } = vector1;
    const result = [];
    for (let row = 0; row < length; row++)
      result[row] = vector1[row] + vector2[row];
    return result;
  }
  minMax(vector) {
    let min = Infinity;
    let max = -Infinity;
    vector.forEach((value) => {
      if (value < min) min = value;
      if (value > max) max = value;
    });
    return [min, max];
  }
}
