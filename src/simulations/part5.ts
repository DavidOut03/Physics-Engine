import { DynamicBody } from "../body";
import type { Canvas } from "../canvas";
import { Simulation } from "../simulation";
import { clamp } from "../utils/math";
import { Vector2D } from "../vector";

export class Part5 extends Simulation {

    balls: Ball[] = [];
    showVectors: boolean = false;
    restitution: number = .8;

    public init(_: Canvas): void {
      this.setUnits("meters");
      this.setWorldSize(16, 9);

      if(this.balls.length > 0)
        return;

      this.balls = [
        new Ball(new Vector2D(5, 4.5), new Vector2D(-3, 0), 2, .25),
        new Ball(new Vector2D(8, 4.5), Vector2D.zero(), 5, .75),
        new Ball(new Vector2D(11, 4.5), new Vector2D(3, 0), 20, 1)
      ];
    }

    public update(deltaTime: number): void {
      this.balls.forEach((body: Ball, _: number) => {
        body.update(deltaTime)

        const bound = this.getWorldSize();

        const bottom = body.radius + body.position.y;
        const top = body.position.y - body.radius;
        const left = body.position.x - body.radius;
        const right = body.position.x + body.radius;

        const minX = body.radius;
        const minY = body.radius;

        const maxY = bound.height - body.radius;
        const maxX = bound.width - body.radius;

        if(bottom >= bound.height) {
          body.position = new Vector2D(body.position.x,
            clamp(minY, body.position.y - (bottom - bound.height), maxY)
          )
          body.velocity = new Vector2D(body.velocity.x, 0).add(new Vector2D(0, body.velocity.y * (-1 * this.restitution)))
        }

        if(top <= 0) {
          body.position = new Vector2D(body.position.x,
            clamp(minY,   body.position.y - top, maxY)
          )
          body.velocity = new Vector2D(body.velocity.x, 0).add(new Vector2D(0, body.velocity.y * (-1 * this.restitution)))
        }

        if(right >= bound.width) {
          body.position = new Vector2D(
            clamp(minX, body.position.x - (right - bound.width), maxX), body.position.y)
          body.velocity = new Vector2D(0, body.velocity.y).add(new Vector2D(body.velocity.x * (-1 * this.restitution), 0))
        }

        if(left <= 0) {
          body.position = new Vector2D(
            clamp(minX, body.position.x - left, maxX), body.position.y)
          body.velocity = new Vector2D(0, body.velocity.y).add(new Vector2D(body.velocity.x * (-1 * this.restitution), 0))
        }

        body.velocity = body.velocity.subtract(new Vector2D(body.velocity.x * deltaTime * 0.1, 0))
      });
    }

    public draw(canvas: Canvas): void {

      this.balls.forEach((body: Ball) => {
            canvas.drawCircle(body.radius, body.position.x, body.position.y, "red");

        if(this.showVectors)
          canvas.drawVector(body.position.x, body.position.y, body.velocity, body.radius);
      })
    }

    public getKeyboardShortCuts(): Record<string, () => void> {
      return {
        "v": () => this.showVectors = !this.showVectors,
        "w": () => this.balls.forEach((b) => {
          b.setWind(b.getWind() === 0 ? 5 : 0)
        })
      }
    }

}

class Ball extends DynamicBody {}
