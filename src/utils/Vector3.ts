export class Vector3 {
  public x: number;
  public y: number;
  public z: number;

  constructor(x: number = 0, y: number = 0, z: number = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  public add = (v: Vector3) => {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
  };

  public subtract = (v: Vector3) => {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    return this;
  };

  public multiply = (v: Vector3 | number) => {
    if (v instanceof Vector3) {
      this.x *= v.x;
      this.y *= v.y;
      this.z *= v.z;
    } else {
      this.x *= v;
      this.y *= v;
      this.z *= v;
    }
    return this;
  };

  public divide = (v: Vector3 | number) => {
    if (v instanceof Vector3) {
      this.x /= v.x;
      this.y /= v.y;
      this.z /= v.z;
    } else {
      this.x /= v;
      this.y /= v;
      this.z /= v;
    }
    return this;
  };

  public equals = (v: Vector3) => {
    return this.x === v.x && this.y === v.y && this.z === v.z;
  };

  public dot = (v: Vector3) => {
    // prettier-ignore
    return (this.x * v.x) + (this.y * v.y) + (this.z * v.z);
  };

  public cross = (v: Vector3): Vector3 => {
    return new Vector3(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x
    );
  };

  public magnitude = () => {
    return Math.sqrt(this.dot(this));
  };

  public normalize = () => {
    const magitude = this.magnitude();
    return magitude === 0 ? this : this.divide(this.magnitude());
  };

  public min = () => {
    return Math.min(Math.min(this.x, this.y), this.z);
  };

  public max = () => {
    return Math.max(Math.max(this.x, this.y), this.z);
  };

  public limit = (max: number) => {
    const squareMagnitude = this.dot(this);
    if (squareMagnitude > max * max) {
      this.divide(Math.sqrt(squareMagnitude)); // normalize
      this.multiply(max);
    }
    return this;
  };

  public set = (x: number = 0, y: number = 0, z: number = 0) => {
    this.x = x;
    this.y = y;
    this.z = z;
  };

  public toAngles = () => {
    return {
      theta: Math.atan2(this.z, this.x),
      pi: Math.asin(this.y / this.magnitude())
    };
  };

  public angleTo = (v: Vector3) => {
    return Math.acos(this.dot(v) / (this.magnitude() * v.magnitude()));
  };

  public clone = (): Vector3 => {
    return new Vector3(this.x, this.y, this.z);
  };

  public toArray = () => {
    return [this.x, this.y, this.z];
  };

  public toFloatArray32 = () => {
    return new Float32Array([this.x, this.y, this.z]);
  };
}
