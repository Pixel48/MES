export default class ElementDv {
  constructor(η_, ξ_) {
    // console.dir({ η_, ξ_ }, { depth: null });
    this.dη = [];
    this.dξ = [];

    if (η_.length != ξ_.length)
      throw new Error('η_ and ξ_ must have the same length');
    else this.length = η_.length;

    for (let point = 0; point < ξ_.length; point++) {
      this.dη[point] ??= [];
      this.dξ[point] ??= [];
      // a = ξ
      this.dξ[point][0] = -0.25 * (1 - η_[point]);
      this.dξ[point][1] = 0.25 * (1 - η_[point]);
      this.dξ[point][2] = 0.25 * (1 + η_[point]);
      this.dξ[point][3] = -0.25 * (1 + η_[point]);
      // a = η
      this.dη[point][0] = -0.25 * (1 - ξ_[point]);
      this.dη[point][1] = -0.25 * (1 + ξ_[point]);
      this.dη[point][2] = 0.25 * (1 + ξ_[point]);
      this.dη[point][3] = 0.25 * (1 - ξ_[point]);
      // this.dη[point] = du_;
      // this.dξ[point] = du_;
    }
  }
}
