export default class HPC {
  constructor(pointID, Nd, jacobian, cond) {
    this.x = [];
    this.y = [];
    this.result = [];

    for (let _ = 0; _ < 4; _++) {
      this.x.push([undefined, undefined, undefined, undefined]);
      this.y.push([undefined, undefined, undefined, undefined]);
      this.result.push([undefined, undefined, undefined, undefined]);
    }
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        this.x[i][j] = Nd.dx[pointID][i] * Nd.dy[pointID][j];
        this.y[i][j] = Nd.dy[pointID][i] * Nd.dx[pointID][j];
        this.result[i][j] =
          (Nd.dx[pointID][i] * Nd.dx[pointID][j] +
            Nd.dy[pointID][i] * Nd.dy[pointID][j]) *
          jacobian.det *
          cond;
      }
    }
  }
}
