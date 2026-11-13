/**
 *  Constants
 */

import type { Vector2D } from "./vector";



export class Canvas {

  constructor(public element: HTMLCanvasElement) {
    this.updateCanvasSize()
    window.onresize = () => this.updateCanvasSize()
  }

  getHeight(): number {
    return this.element.clientHeight;
  }

  getWidth(): number {
    return this.element.clientWidth;
  }

  getCenterX(): number {
    return this.getWidth() / 2;
  }

  getCenterY(): number {
    return this.getHeight() / 2;
  }

  getContext(): CanvasRenderingContext2D | null {
    return this.element.getContext("2d")!;
  }

  updateCanvasSize() {
    const context = this.getContext();
    if(context == null)
      return;

    const devicePixelRatio  = window.devicePixelRatio || 1;
    const cssWidth = window.innerWidth;
    const cssHeight = window.innerHeight;

    this.element.style.width = cssWidth + "px";
    this.element.style.height = cssHeight + "px";

    this.element.width = Math.round(cssWidth * devicePixelRatio);
    this.element.height = Math.round(cssHeight * devicePixelRatio);

    context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }

  clear() {
    const context = this.getContext();
    if(context == null)
      return;

     context.clearRect(0, 0, this.getWidth(), this.getHeight());
  }

  /**
   * Possible things to draw
   */
  drawText(text: string, x: number = 0, y: number = 0, options?: TextOptions) {
    const context = this.getContext();
    if(context == null)
      return;

    context.beginPath()
    context.font = `${options?.size ?? 15}px sans-serif`;
    context.fillStyle = `${options?.color ?? "white"}`;
    context.fillText(text, x, y);
  }

  // drawDot(deg: number): void {
  //   const radian = toRadian(deg)
  //   const x = getCenterX() + (circleRadius + 0 /* gap */) * Math.cos(radian);
  //   const y = getCenterY() + (circleRadius + 0 /* gap */) * Math.sin(radian)

  //   drawCircle(5, x, y, "green")
  // }


drawCircle(size: number, x: number, y: number, color: string): void {
  let context = this.getContext();

  if(!context)
    return

  context.beginPath();
  context.arc(x, y, size, 0, Math.PI * 2);
  context.fillStyle = color;
  context.fill()
}

drawVector(xStart: number, yStart: number, vector: Vector2D, offset: number = 0, scale: number = 1): void {
  let context = this.getContext();

  if (!context || (vector.x === 0 && vector.y === 0))
    return;


  const angle = vector.angle();
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  xStart = xStart + offset * cos;
  yStart = yStart + offset * sin;

  const arrowLength = vector.length() * scale;
  const x2 = xStart + arrowLength * cos;
  const y2 = yStart + arrowLength * sin;


  // Hoofdlijn tekenen
  context.beginPath();
  context.moveTo(xStart, yStart);
  context.lineTo(x2, y2);
  context.lineWidth = 2; // Set lineWidth here too so the blue shaft matches the green tip
  context.strokeStyle = "blue";
  context.stroke();

  // Pijlpunt lijnen
  const headLength = 10;
  context.beginPath();
  context.moveTo(x2, y2);
  context.lineTo(
    x2 - headLength * Math.cos(angle - Math.PI / 6),
    y2 - headLength * Math.sin(angle - Math.PI / 6)
  );
  context.moveTo(x2, y2);
  context.lineTo(
    x2 - headLength * Math.cos(angle + Math.PI / 6),
    y2 - headLength * Math.sin(angle + Math.PI / 6)
  );

  context.strokeStyle = "green";
  context.stroke();
}

}

interface TextOptions {
  font?: string;
  color?: string;
  size: number
}

/**
 *  Canvas utils
 */

// export function draw() {
//   resetCanvasSize();


//   context.beginPath();
//   context.moveTo(0, 0);
//   context.lineTo(getWidth(), getHeight())
//   context.strokeStyle = "red";
//   context.stroke()

//   context.beginPath()
//   context.font = "50px serif";
//   context.fillStyle = "blue"
//   context.fillText("Hello world", 50, 90);


//   const circleRadius = 50;
//   drawCircle(circleRadius, getCenterX(), getCenterY(), "orange")




//   for (let i = 0; i < 12; i++) {
//     drawDot(-90 + i * 30)
//   }
