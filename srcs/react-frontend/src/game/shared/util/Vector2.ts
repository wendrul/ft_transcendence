class Vector2 {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  add(other: Vector2) {
    const x = this.x + other.x;
    const y = this.y + other.y;
    return new Vector2(x, y);
  }

  subtract(other: Vector2) {
    return this.add(other.scale(-1));
  }

  scale(scalar: number) {
    const x = this.x * scalar;
    const y = this.y * scalar;
    return new Vector2(x, y);
  }

  norm() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  dot(other: Vector2) {
    return this.x * other.x + this.y * other.y;
  }

  rotate(theta: number) {
    const x = Math.cos(theta) * this.x - Math.sin(theta) * this.y;
    const y = Math.sin(theta) * this.x + Math.cos(theta) * this.y;
    return new Vector2(x, y);
  }

  normalized() {
    const p = this.norm();
    const x = this.x / p;
    const y = this.y / p;
    return new Vector2(x, y);
  }

  /**
   * Set the vector values from polar coordinates
   * 
   * @param magnitude 
   * @param theta 
   */
  setFromPolarCoords(magnitude: number, theta: number) {
    let p = new Vector2(0, magnitude);
    p = p.rotate(theta);
    this.x = p.x;
    this.y = p.y;
  }

  /**
   * Assuming we extend the 2D vectors to 3D space (with z = 0), computes the
   * cross product and returns the z value of the result
   * 
   * @param other 
   */
  cross(other : Vector2) : number {
    return this.x * other.y - this.y * other.x;
  }

  clone() {
    return new Vector2(this.x, this.y);
  }

  dist(other: Vector2) {
    return other.subtract(this).norm();
  }
}

export default Vector2;
