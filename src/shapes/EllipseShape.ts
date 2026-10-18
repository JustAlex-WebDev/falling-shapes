import { Shape } from "./Shape";

export class EllipseShape extends Shape {
  private readonly radiusX: number;
  private readonly radiusY: number;

  constructor(
    x: number,
    y: number,
    color: number,
    radiusX: number,
    radiusY: number,
  ) {
    super("ellipse", x, y, color);
    this.radiusX = radiusX;
    this.radiusY = radiusY;
    this.draw();
  }

  protected draw(): void {
    this.graphics.ellipse(0, 0, this.radiusX, this.radiusY);
    this.paint();
  }

  public getArea(): number {
    return Math.PI * this.radiusX * this.radiusY;
  }
}
