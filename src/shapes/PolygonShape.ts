import type { PointData } from "pixi.js";
import { Shape } from "./Shape";
import type { ShapeKind } from "./ShapeKind";

export abstract class PolygonShape extends Shape {
  private readonly points: PointData[];

  constructor(
    kind: ShapeKind,
    x: number,
    y: number,
    color: number,
    points: PointData[],
  ) {
    super(kind, x, y, color);
    this.points = points;
    this.draw();
  }

  protected draw(): void {
    this.graphics.poly(this.points);
    this.paint();
  }

  public getArea(): number {
    let sum = 0;
    for (let i = 0; i < this.points.length; i++) {
      const a = this.points[i];
      const b = this.points[(i + 1) % this.points.length];
      sum += a.x * b.y - b.x * a.y;
    }
    return Math.abs(sum) / 2;
  }
}
