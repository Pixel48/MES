export default class HPC {
  constructor(point, Nd, jacobian, cond) {
    this.x = [];
    this.y = [];
    this.result = [];

    for (let _ = 0; _ < 4; _++) {
      this.x.push([undefined, undefined, undefined, undefined]);
      this.y.push([undefined, undefined, undefined, undefined]);
      this.result.push([undefined, undefined, undefined, undefined]);
    }
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        this.x[row][col] = Nd.dx[point][row] * Nd.dy[point][col];
        this.y[row][col] = Nd.dy[point][row] * Nd.dx[point][col];
        this.result[row][col] =
          (Nd.dx[point][row] * Nd.dx[point][col] +
            Nd.dy[point][row] * Nd.dy[point][col]) *
          jacobian.detJ *
          cond;
      }
    }
  }
}
