import { printMatrix } from './index.js';

export default class GlobalC {
  constructor(C_, dataset) {
    const { elements, nodes } = dataset;

    this.matrix = [];
    for (let row = 0; row < nodes.length; row++) {
      this.matrix[row] = [];
      for (let col = 0; col < nodes.length; col++) {
        this.matrix[row][col] = 0;
      }
    }

    elements.forEach((element, elementIndex) => {
      const { nodes } = element;

      elements.forEach((element, elementIndex) => {
        for (let row = 0; row < 4; row++)
          for (let col = 0; col < 4; col++) {
            this.matrix[nodes[row].index][nodes[col].index] ??= 0;
            this.matrix[nodes[row].index][nodes[col].index] +=
              C_[elementIndex].matrix[row][col] / dataset.simStepTime;
          }
      });
    });
    console.debug('\t\t### C GLOBAL MATRIX ###');
    printMatrix(this.matrix);
  }
}
