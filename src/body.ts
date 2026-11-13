import type { Canvas } from "./canvas";
import { Vector2D } from "./vector";

export interface Position {
  x: number;
  y: number;
}

export abstract class Body {

  constructor(
    public position: Position,
    public velocity: Vector2D,
    public accelleration: number,
    public radius: number
  ) {}


  update(deltaTime: number): void {
    this.velocity = new Vector2D(this.velocity.x, this.velocity.y + this.accelleration * deltaTime);
    this.position.x += (this.velocity.x * deltaTime);
    this.position.y += (this.velocity.y * deltaTime);
  }

  abstract draw(canvas: Canvas): void;
}
