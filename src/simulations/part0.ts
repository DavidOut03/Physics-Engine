import type { Canvas } from "../canvas";
import { Simulation } from "../simulation";
import { toRadian } from "../utils/math";

export class Part0 extends Simulation {

  public init(canvas: Canvas): void {
      this.setWorldSize(canvas.getWidth(), canvas.getHeight());
  }

    public update(deltaTime: number): void {

    }
    public draw(canvas: Canvas): void {
      const context = canvas.getContext();

      if(context == null)
        return;

      context.beginPath();
      context.moveTo(0, 0);
      context.lineTo(this.getWorldSize().width, this.getWorldSize().height)
      context.strokeStyle = "red";
      context.lineWidth = 2;
      context.stroke();

      context.beginPath()
      context.font = "50px serif";
      context.fillStyle = "blue"
      context.textBaseline = "top";
      context.fillText("Hello world", 10, 30);

        const circleRadius = 50;
        canvas.drawCircle(circleRadius, canvas.getCenterX(), canvas.getCenterY(), "orange")

        for (let i = 0; i < 12; i++) {
          this.drawDot(canvas, -90 + i * 30)
        }

    }

    drawDot(canvas: Canvas, deg: number): void {
      const radian = toRadian(deg)
      const x = canvas.getCenterX() + (50 + 0 /* gap */) * Math.cos(radian);
      const y = canvas.getCenterY() + (50 + 0 /* gap */) * Math.sin(radian)

      canvas.drawCircle(5, x, y, "green")
    }

}
