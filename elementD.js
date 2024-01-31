export default class ElementD {
  constructor(Jpc, div) {
    this.dx = [];
    this.dy = [];

    for (let point = 0; point < div.length; point++) {
      const { revJ, detJ } = Jpc[point];
      for (let col = 0; col < 4; col++) {
        this.dx[point] ??= [];
        this.dy[point] ??= [];

        this.dx[point][col] =
          (1 / detJ) * revJ[0][0] * div.dξ[point][col] +
          (1 / detJ) * revJ[1][0] * div.dη[point][col];
        this.dy[point][col] =
          (1 / detJ) * revJ[1][1] * div.dη[point][col] +
          (1 / detJ) * revJ[0][1] * div.dξ[point][col];
      }
    }
    // console.debug(this);
  }
}
