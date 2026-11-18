import { Vector2D } from "./vector";

export abstract class Body {

  constructor(
    public position: Vector2D,
    public velocity: Vector2D,
    public accelleration: Vector2D,
    public radius: number
  ) {}


  update(deltaTime: number): void {
    this.velocity = this.velocity.add(this.accelleration.scale(deltaTime));
    this.position = this.position.add(this.velocity.scale(deltaTime))
  }
}
