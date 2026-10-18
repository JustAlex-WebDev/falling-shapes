import { Shape } from "./Shape";

export class CircleShape extends Shape {
  private radius: number;

  constructor(x: number, y: number, color: number, radius: number) {
    super("circle", x, y, color);
    this.radius = radius;
    this.draw();
  }

  protected draw(): void {
    this.graphics.circle(0, 0, this.radius);
    this.paint();
  }

  public getArea(): number {
    return Math.PI * this.radius ** 2;
  }
}
