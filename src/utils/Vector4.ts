export class Vector4 {
  public x: number;
  public y: number;
  public z: number;
  public w: number;

  constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 1) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  public add = (v: Vector4) => {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    this.w += v.w;

    return this;
  };

  public subtract = (v: Vector4) => {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    this.w -= v.w;

    return this;
  };

  public multiply = (v: Vector4 | number) => {
    if (v instanceof Vector4) {
      this.x *= v.x;
      this.y *= v.y;
      this.z *= v.z;
      this.w *= v.w;
    } else {
      this.x *= v;
      this.y *= v;
      this.z *= v;
      this.w *= v;
    }
    return this;
  };

  public divide = (v: Vector4 | number) => {
    if (v instanceof Vector4) {
      this.x /= v.x;
      this.y /= v.y;
      this.z /= v.z;
      this.w /= v.w;
    } else {
      this.x /= v;
      this.y /= v;
      this.z /= v;
      this.w /= v;
    }
    return this;
  };

  public equals = (v: Vector4) => {
    return v.x === this.x && v.y === this.y && v.z === this.z && v.w === this.w;
  };

  public dot = (v: Vector4) => {
    // prettier-ignore
    return (this.x * v.x) + (this.y * v.y) + (this.z * v.z) + (this.w * v.w);
  };

  public magnitude = () => {
    return Math.sqrt(this.dot(this));
  };

  public normalize = () => {
    const magitude = this.magnitude();
    return magitude === 0 ? this : this.divide(this.magnitude());
  };

  public min = () => {
    return Math.min(Math.min(Math.min(this.x, this.y), this.z), this.w);
  };

  public max = () => {
    return Math.max(Math.max(Math.max(this.x, this.y), this.z), this.w);
  };

  public limit = (max: number) => {
    const squareMagnitude = this.dot(this);
    if (squareMagnitude > max * max) {
      this.divide(Math.sqrt(squareMagnitude)); // normalize
      this.multiply(max);
    }
    return this;
  };

  public set = (x: number = 0, y: number = 0, z: number = 0, w: number = 0) => {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;

    return this;
  };

  public clone = (): Vector4 => {
    return new Vector4(this.x, this.y, this.z, this.w);
  };

  public toArray = () => {
    return [this.x, this.y, this.z, this.w];
  };

  public toFloatArray32 = () => {
    return new Float32Array([this.x, this.y, this.z, this.w]);
  };
}
