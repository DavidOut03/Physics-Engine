export class Vector2D {

  constructor(public x: number, public y : number) {}

  /**
   * Adds two vectors together
   */
  add(vector: Vector2D): Vector2D {
     return new Vector2D(this.x + vector.x, this.y + vector.y);
  }

  /**
   * Subtract a vector
   */
  subtract(vector: Vector2D): Vector2D {
    return new Vector2D(this.x - vector.x, this.y - vector.y);
  }

  /**
   *  Increases the vector to an n amount, when negative turns the around
   */
  scale(n: number): Vector2D {
    return new Vector2D(this.x * n, this.y * n);
  }

  /**
   * Pytagoras a^2 + b^2 = c^2
   */
  length(): number {
    return Math.sqrt(this.lengthSquared());
  }

  lengthSquared(): number {
    return (this.x ** 2) + this.y ** 2;
  }

  normalize(): Vector2D {
    let l = this.length();
    if(l === 0) return new Vector2D(0, 0);
    return new Vector2D(this.x / l, this.y / l);
  }


  dotProduct(v: Vector2D): number {
    return this.x * v.x + this.y * v.y;
  }

  distanceTo(v: Vector2D): number {
    return this.subtract(v).length()
  }

  angle(): number {
    return Math.atan2(this.y, this.x);
  }

  /**
   * The same vector but rotated a quarter
   */
  perpendicular(): Vector2D {
    return new Vector2D(-1 * this.y, this.x);
  }

  static fromAngle(angle: number, length = 1): Vector2D {
    return new Vector2D(Math.cos(angle) * length, length * Math.sin(angle))
  }


  static zero(): Vector2D {
    return new Vector2D(0,0);
  }


  toString() {
      const rx = Number(this.x.toFixed(1));
      const ry = Number(this.y.toFixed(1));
      return `(${rx},${ry})`;
  }




}
