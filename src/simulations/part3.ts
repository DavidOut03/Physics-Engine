import type { Canvas } from "../canvas";
import { Simulation } from "../simulation";
import { Vector2D } from "../vector";
import {Body} from '../body';

export class Part3 extends Simulation {

  showVectors: boolean = false;
  bodies: Ball[] = [];

  gravity: number = 9.81

  public init(_: Canvas): void {
    this.setUnits("meters");
    this.setWorldSize(16, 9);

    if(this.bodies.length > 0)
      return;

    this.bodies = [
      new Ball(new Vector2D(5, 4.5), Vector2D.zero(), new Vector2D(0, this.gravity), .25, "red"),
      new Ball(new Vector2D(8, 4.5), Vector2D.zero(), new Vector2D(0, this.gravity), .75, "red"),
      new Ball(new Vector2D(11, 4.5), Vector2D.zero(), new Vector2D(0, this.gravity), 1, "red")
    ];
  
  }

    public update(deltaTime: number): void {
      this.bodies.forEach((body: Body) => {
        body.update(deltaTime)
        const bound = this.getWorldSize();

        if(body.position.x > bound.width || body.position.x < 0)
          body.position.x = 0

        if(body.position.y > bound.height || body.position.y < 0)
          body.position.y = 0
      });
    }

    public draw(canvas: Canvas): void {
      this.bodies.forEach((body: Ball) => {
            canvas.drawCircle(body.radius, body.position.x, body.position.y, body.color);

        if(this.showVectors)
          canvas.drawVector(body.position.x, body.position.y, body.velocity, body.radius);
      })
    }

  public getKeyboardShortCuts(): Record<string, () => void> {
    return {
      "v": () => this.showVectors = !this.showVectors
    }
  }

}


class Ball extends Body {

  constructor(
    position: Vector2D,
    velocity: Vector2D,
    accelleration: Vector2D,
    radius: number,
    public color: string) {
    super(position, velocity, accelleration, radius)
  }

}
