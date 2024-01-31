export default class Jacobian {
  jQuad(axis, da) {
    let sum = 0;
    for (let i = 0; i < 4; i++) sum += da[i] * axis[i];
    return sum;
  }
  constructor(dv, x, y, id) {
    this.J = [
      [undefined, undefined], // X/ξ | Y/ξ
      [undefined, undefined], // X/η | Y/η
    ];

    this.revJ = [
      [undefined, undefined],
      [undefined, undefined],
    ];

    // // dxdξ | dydξ
    // // dxdη | dydη

    this.J = [
      // [this.jQuad(x, dv.dξ[id]), this.jQuad(y, dv.dξ[id])],
      // [this.jQuad(y, dv.dη[id]), this.jQuad(x, dv.dη[id])],
      // ]; // BUG: this should not be working! there's some problem before calculating this
      // should be this:
      // this.J = [
      [this.jQuad(x, dv.dξ[id]), this.jQuad(y, dv.dξ[id])],
      [this.jQuad(x, dv.dη[id]), this.jQuad(y, dv.dη[id])],
    ];

    // J[1][1] | -J[0][1]
    // -J[1][0] | J[0][0]
    this.revJ[0][0] = this.J[1][1];
    this.revJ[0][1] = -this.J[0][1];
    this.revJ[1][0] = -this.J[1][0];
    this.revJ[1][1] = this.J[0][0];

    // a | b
    // c | d
    // det = ad - bc
    this.detJ = this.J[0][0] * this.J[1][1] - this.J[0][1] * this.J[1][0];
    this.xdξ = this.J[0][0];
    this.ydξ = this.J[0][1];
    this.xdη = this.J[1][0];
    this.ydη = this.J[1][1];

    // J as vector
    this.Jv = [this.J[0][0], this.J[0][1], this.J[1][0], this.J[1][1]];
  }
}
