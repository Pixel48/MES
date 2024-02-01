import path from 'path';
import { elimination as gaussianElimination } from './gauss.js';
import fs from 'fs';

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

    this.makeHeader(dataset);
  }
  logging(output = false, border = false) {
    if (output) console.log(this.steps[this._step]);
    if (border)
      console.log({
        step: this._step,
        minMax: this.minMax(this.steps[this._step]),
      });
    if (!output && !border) process.stdout.write('.');
  }
  step(output = false, border = false) {
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
    this.logging(output, border);
    /* #endregion */
  }
  run(output = false, border = false) {
    console.debug(`=== SIMULATION START (${this.endStep} steps) ===`);
    this.logging(output, border);
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
  recursiveMkdir(dir) {
    // console.debug(`recursiveMkdir(${dir})`);
    // if (dir == '.' || dir == '..') return;
    if (!fs.existsSync(dir)) {
      this.recursiveMkdir(path.dirname(dir));
      fs.mkdirSync(dir);
    }
  }
  save(outputBase) {
    // const output = path
    //   .basename(outputPath)
    //   .replace(path.extname(outputPath), '');
    // this.recursiveMkdir(output);
    // if (this._step != this.endStep) this.run();

    // const outputDir = outputPath.replace(/\/\..+$/, '');
    // this.steps.forEach((step, stepIndex) => {
    //   const fileContent = this.fileHeader + step.join('\n');
    //   const fileName = `${output}_${stepIndex.toString().padStart(3, '0')}.vtk`;
    //   fs.writeFileSync(`${output}/${fileName}`, fileContent);
    // });

    const filenameBase = path
      .basename(outputBase)
      .replace(path.extname(outputBase), '');

    const outputDir = path.join(
      path.dirname(outputBase),
      path.basename(outputBase).replace(path.extname(outputBase), '')
    );

    this.recursiveMkdir(outputDir);

    this.steps.forEach((step, stepIndex) => {
      const filenameSuffix = stepIndex.toString().padStart(3, '0');
      const filename = filenameBase + '_' + filenameSuffix + '.vtk';
      const fileContent = this.fileHeader + step.join('\n');
      fs.writeFileSync(path.join(outputDir, filename), fileContent);
    });

    console.debug(`\n=== SIMULATION END (Saved into ${outputDir}) ===`);
    console.debug();
  }
  makeHeader(dataset) {
    this.fileHeader =
      '# vtk DataFile Version 2.0\nUnstructured Grid Example\nASCII\nDATASET UNSTRUCTURED_GRID\n\n';
    this.fileHeader += `POINTS ${dataset.nodes.length} float\n`;
    dataset.nodes.forEach(
      (node) => (this.fileHeader += `${node.x} ${node.y} 0\n`)
    );
    this.fileHeader += '\n';
    this.fileHeader += `CELLS ${dataset.elements.length} ${
      5 * dataset.elements.length
    }\n`;
    dataset.elements.forEach((element) => {
      this.fileHeader += '4';
      element.nodes.forEach((node) => (this.fileHeader += ` ${node.index}`));
      this.fileHeader += '\n';
    });
    this.fileHeader += '\n';
    this.fileHeader += `CELL_TYPES ${dataset.elements.length}\n`;
    dataset.elements.forEach((_, elementIndex) => (this.fileHeader += '9\n'));
    this.fileHeader += '\n';
    this.fileHeader += `POINT_DATA ${dataset.nodes.length}\n`;
    this.fileHeader += 'SCALARS temperature float 1\n';
    this.fileHeader += 'LOOKUP_TABLE default\n';
  }
}
