import type { PointData } from "pixi.js";
import { PolygonShape } from "./PolygonShape";

export class IrregularShape extends PolygonShape {
  constructor(
    x: number,
    y: number,
    color: number,
    minRadius: number,
    maxRadius: number,
  ) {
    super(
      "irregular",
      x,
      y,
      color,
      IrregularShape.createPoints(minRadius, maxRadius),
    );
  }

  private static createPoints(
    minRadius: number,
    maxRadius: number,
  ): PointData[] {
    const points: PointData[] = [];
    const cornerCount = 5 + Math.floor(Math.random() * 6);
    const slice = (Math.PI * 2) / cornerCount;

    for (let i = 0; i < cornerCount; i++) {
      const angle = i * slice + Math.random() * slice;
      const radius = minRadius + Math.random() * (maxRadius - minRadius);
      points.push({ x: Math.cos(angle) * radius, y: Math.sin(angle) * radius });
    }

    return points;
  }
}
