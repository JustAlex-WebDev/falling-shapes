import { PolygonShape } from "./PolygonShape";
import { regularPolygonPoints } from "./geometry";
import { POLYGON_SIDES, type PolygonKind } from "./ShapeKind";

export class RegularPolygonShape extends PolygonShape {
  constructor(
    x: number,
    y: number,
    color: number,
    kind: PolygonKind,
    radius: number,
  ) {
    super(kind, x, y, color, regularPolygonPoints(POLYGON_SIDES[kind], radius));
  }
}
