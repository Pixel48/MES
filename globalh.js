export default class GlobalH {
  constructor(H_, Hbc_, dataset) {
    // console.dir({ H_ }, { depth: null });
    const { elements, nodes } = dataset;

    this.matrix = [];
    for (let row = 0; row < nodes.length; row++) {
      this.matrix[row] = [];
      for (let col = 0; col < nodes.length; col++) {
        this.matrix[row][col] = 0;
      }
    }

    this.P = [];

    elements.forEach((element, elementIndex) => {
      const { nodes } = element;
      for (let row = 0; row < 4; row++) {
        this.P[nodes[row].index] ??= 0;
        this.P[nodes[row].index] += Hbc_[elementIndex].P[row];

        for (let col = 0; col < 4; col++) {
          this.matrix[nodes[row].index][nodes[col].index] +=
            H_[elementIndex].matrix[row][col] +
            Hbc_[elementIndex].matrix[row][col];
          // + C_[elementIndex].matrix[row][col];
        }
      }
    });
  }
}
