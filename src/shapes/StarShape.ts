import { PolygonShape } from "./PolygonShape";
import { starPoints } from "./geometry";

export class StarShape extends PolygonShape {
  constructor(
    x: number,
    y: number,
    color: number,
    tips: number,
    outerRadius: number,
    innerRadius: number,
  ) {
    super("star", x, y, color, starPoints(tips, outerRadius, innerRadius));
  }
}
