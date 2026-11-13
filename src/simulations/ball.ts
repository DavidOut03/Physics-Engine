import type { Canvas } from "../canvas";
import { CanvasController, Simulation } from "../simulation";
import { Vector2D } from "../vector";
import {Body, type Position} from '../body';

export class BallSimulation extends Simulation {

  showVectors: boolean = false;
  bodies: Body[] = [];

  pixelsPerMeter: number = 50;
  gravity: number = 9.81 * this.pixelsPerMeter;

  constructor(private canvas: Canvas) {
    super();

    let controller = new CanvasController({
      "s": () => this.getPlaybackSpeed() == 1 ? this.setPlaybackSpeed(0.2) : this.setPlaybackSpeed(1),
      "v": () => this.showVectors = !this.showVectors
    });
    controller.attach(canvas)
    this.addBalls()
  }

  addBalls() {
    for(var i = 0; i < Math.random() * 20; i++) {
      var x = Math.random() * this.canvas.getWidth();
      var y = Math.random() * this.canvas.getHeight();
      var velocity = new Vector2D(0, 0);
      var size = 5 + Math.random() * 15;
      var color = "white";

      this.bodies.push(new Ball({
        x: x,
        y: y
      } as Position, velocity, this.gravity, size, color));
    }
  }

    public update(deltaTime: number): void {
      this.bodies.forEach((body: Body) => {
        body.update(deltaTime)

        if(body.position.x > this.canvas.getWidth() || body.position.x < 0)
          body.position.x = 0

        if(body.position.y > this.canvas.getHeight() || body.position.y < 0)
          body.position.y = 0
      });
    }

    public draw(canvas: Canvas): void {
      this.bodies.forEach((body: Body) => {
        body.draw(canvas)

        if(this.showVectors)
          canvas.drawVector(body.position.x, body.position.y, body.velocity, body.radius);
      })
    }

}


class Ball extends Body {

  constructor(
    position: Position,
    velocity: Vector2D,
    accelleration: number,
    radius: number,
    public color: string) {
    super(position, velocity, accelleration, radius)

    this.color = color;
  }

  draw(canvas: Canvas): void {
    canvas.drawCircle(this.radius, this.position.x, this.position.y, this.color);
  }

}
