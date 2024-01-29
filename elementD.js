export default class ElementD {
  constructor(J, div) {
    this.dx = [];
    this.dy = [];
    for (let row = 0; row < div.length; row++) {
      this.dx.push([]);
      this.dy.push([]);
      for (let _ = 0; _ < 4; _++) {
        this.dx[row].push(undefined);
        this.dy[row].push(undefined);
      }
    }

    const { revJ, detJ } = J;
    for (let point = 0; point < div.length; point++) {
      for (let col = 0; col < 4; col++) {
        this.dx[point][col] =
          (1 / detJ) * revJ[0][0] * div.dξ[point][col] +
          (1 / detJ) * revJ[1][0] * div.dη[point][col];
        this.dy[point][col] =
          (1 / detJ) * revJ[0][1] * div.dη[point][col] +
          (1 / detJ) * revJ[1][1] * div.dξ[point][col];
      }
    }
  }
}
