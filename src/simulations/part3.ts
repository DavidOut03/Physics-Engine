import type { Canvas } from "../canvas";
import { Simulation } from "../simulation";
import { Vector2D } from "../vector";
import {Body} from '../body';

export class BallSimulation extends Simulation {

  showVectors: boolean = false;
  bodies: Ball[] = [];

  gravity: number = 9.81

  public init(_: Canvas): void {
    this.setUnits("meters");
    this.setWorldSize(16, 9);

    if(this.bodies.length > 0)
      return;

    const totalBalls = 30;
    for(var i = 0; i < totalBalls; i++) {
      var x = Math.random() * this.getWorldSize().width;
      var y = Math.random() * this.getWorldSize().height;
      var velocity = new Vector2D(0, this.gravity);
      var size = Math.random() * .5;
      var color = "white";

      this.bodies.push(new Ball(new Vector2D(x, y), velocity, new Vector2D(0, this.gravity), size, color));
    }
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
