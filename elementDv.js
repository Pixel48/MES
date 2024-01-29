export default class ElementDv {
  constructor(η_, ξ_) {
    this.dη = [];
    this.dξ = [];

    if (η_.length != ξ_.length)
      throw new Error('η_ and ξ_ must have the same length');
    else this.length = η_.length;

    for (let i = 0; i < η_.length; i++) {
      this.dη.push([undefined, undefined, undefined, undefined]);
      this.dξ.push([undefined, undefined, undefined, undefined]);
    }

    const du_ = [];
    for (let point = 0; point < ξ_.length; point++) {
      // a = ξ
      du_[0] = -0.25 * (1 - ξ_[point]);
      du_[1] = 0.25 * (1 - ξ_[point]);
      du_[2] = 0.25 * (1 + ξ_[point]);
      du_[3] = -0.25 * (1 + ξ_[point]);
      this.dη[point] = du_;
      // a = η
      du_[0] = -0.25 * (1 - η_[point]);
      du_[1] = -0.25 * (1 + η_[point]);
      du_[2] = 0.25 * (1 + η_[point]);
      du_[3] = 0.25 * (1 - η_[point]);
      this.dξ[point] = du_;
    }
  }
}
