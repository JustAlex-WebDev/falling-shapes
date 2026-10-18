import type { PointData } from "pixi.js";
import { regularPolygonPoints, starPoints } from "../shapes/geometry";
import { POLYGON_SIDES, type TargetKind } from "../shapes/ShapeKind";

const SVG_NS = "http://www.w3.org/2000/svg";
const RADIUS = 11;

export function createShapeIcon(kind: TargetKind): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", "-12 -12 24 24");
  svg.setAttribute("aria-hidden", "true");
  svg.classList.add("shape-icon");
  svg.append(createIconShape(kind));
  return svg;
}

function createIconShape(kind: TargetKind): SVGElement {
  switch (kind) {
    case "circle":
      return createSvgElement("circle", { r: RADIUS - 1 });
    case "ellipse":
      return createSvgElement("ellipse", { rx: RADIUS, ry: RADIUS * 0.6 });
    case "star":
      return createPolygon(starPoints(5, RADIUS, RADIUS * 0.5));
    default:
      return createPolygon(regularPolygonPoints(POLYGON_SIDES[kind], RADIUS));
  }
}

function createPolygon(points: PointData[]): SVGElement {
  const value = points.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ");
  return createSvgElement("polygon", { points: value });
}

function createSvgElement(
  name: string,
  attributes: Record<string, string | number>,
): SVGElement {
  const element = document.createElementNS(SVG_NS, name);
  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, String(value));
  }
  return element;
}
