export default class HPC {
  constructor(point, Nd, jacobian, cond) {
    this.result = [];

    const { detJ } = jacobian;
    // console.debug({ detJ });
    // console.dir({ Nd }, { depth: null }); // OK

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        this.result[row] ??= [];

        this.result[row][col] =
          cond *
          (Nd.dx[point][row] * Nd.dx[point][col] +
            Nd.dy[point][row] * Nd.dy[point][col]) *
          detJ;
      }
    }
    // console.dir(this.result, { depth: null });
  }
}
