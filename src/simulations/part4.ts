import { DynamicBody } from "../body";
import type { Canvas } from "../canvas";
import { Simulation } from "../simulation";
import { Vector2D } from "../vector";

export class Part4 extends Simulation {

    balls: Ball[] = [];

     showVectors: boolean = false;

    public init(_: Canvas): void {
      this.setUnits("meters");
      this.setWorldSize(16, 9);

      if(this.balls.length > 0)
        return;


      this.balls = [
        new Ball(new Vector2D(5, 4.5), Vector2D.zero(), 2, .25),
        new Ball(new Vector2D(8, 4.5), Vector2D.zero(), 5, .75),
        new Ball(new Vector2D(11, 4.5), Vector2D.zero(), 20, 1)
      ];
    }

    public update(deltaTime: number): void {
      this.balls.forEach((body: Ball) => {
        body.update(deltaTime)
        const bound = this.getWorldSize();

        if(body.position.x > bound.width || body.position.x < 0)
          body.position.x = 0

        if(body.position.y > bound.height || body.position.y < 0)
          body.position.y = 0
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

class Ball extends DynamicBody {

}
