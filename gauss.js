export default function (order) {
  const w = [];
  const x = [];

  switch (order) {
    case 1:
      x.push(0);
      w.push(2);
      break;
    case 2:
      x[0] = -Math.sqrt(1 / 3);
      x[1] = -x[0];
      w[0] = 1;
      w[1] = 1;
      break;
    case 3:
      x[0] = -Math.sqrt(3 / 5);
      x[1] = 0;
      x[2] = -x[0];
      w[0] = 5 / 9;
      w[1] = 8 / 9;
      w[2] = w[0];
      break;
    case 4:
      x[0] = -Math.sqrt(3 / 7 - (2 / 7) * Math.sqrt(6 / 5)); // ^
      x[1] = -Math.sqrt(3 / 7 + (2 / 7) * Math.sqrt(6 / 5)); // v
      x[2] = -x[1]; // + v
      x[3] = -x[0]; // - ^
      w[0] = (18 + Math.sqrt(30)) / 36;
      w[1] = (18 - Math.sqrt(30)) / 36;
      w[2] = w[1];
      w[3] = w[0];
      break;
    case 5:
      x[0] = 0;
      w[0] = 128 / 225;

      x[1] = (1 / 3) * Math.sqrt(5 - 2 * Math.sqrt(10 / 7));
      w[1] = (322 + 13 * Math.sqrt(30)) / 900;
      x[2] = -x[1];
      w[2] = -w[1];

      x[3] = (1 / 3) * Math.sqrt(5 + 2 * Math.sqrt(10 / 7));
      w[3] = (322 - 13 * Math.sqrt(30)) / 900;
      x[4] = -x[3];
      w[4] = -w[3];
      break;
    default:
      throw new Error(`Degree ${order} not implemented`);
  }

  return { x, w };
}

export const elimination = (matrix, vector) => {
  for (let row = 0; row < matrix.length; row++) {
    const div = matrix[row][row];
    for (let col = 0; col < vector.length; col++) {
      matrix[row][col] /= div;
    }
    vector[row] /= div;

    for (let col = 0; col < matrix.length; col++) {
      if (col == row) continue;
      const mult = matrix[col][row];
      for (let i = 0; i < vector.length; i++) {
        matrix[col][i] -= mult * matrix[row][i];
      }
      vector[col] -= mult * vector[row];
    }
  }
  return vector;
};
