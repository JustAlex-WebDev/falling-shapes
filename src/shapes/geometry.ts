import type { PointData } from "pixi.js";

export function regularPolygonPoints(sides: number, radius: number): PointData[] {
  const points: PointData[] = [];
  const step = (Math.PI * 2) / sides;
  const offset = sides % 2 === 0 ? step / 2 : 0;

  for (let i = 0; i < sides; i++) {
    const angle = -Math.PI / 2 + offset + i * step;
    points.push({ x: Math.cos(angle) * radius, y: Math.sin(angle) * radius });
  }

  return points;
}

export function starPoints(
  tips: number,
  outerRadius: number,
  innerRadius: number,
): PointData[] {
  const points: PointData[] = [];
  const step = Math.PI / tips;

  for (let i = 0; i < tips * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = -Math.PI / 2 + i * step;
    points.push({ x: Math.cos(angle) * radius, y: Math.sin(angle) * radius });
  }

  return points;
}
