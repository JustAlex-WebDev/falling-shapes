export const POLYGON_SIDES = {
  triangle: 3,
  square: 4,
  pentagon: 5,
  hexagon: 6,
} as const;

export type PolygonKind = keyof typeof POLYGON_SIDES;
export type TargetKind = PolygonKind | "circle" | "ellipse" | "star";
export type ShapeKind = TargetKind | "irregular";

export const TARGET_KINDS: TargetKind[] = [
  "triangle",
  "square",
  "pentagon",
  "hexagon",
  "circle",
  "ellipse",
  "star",
];

export const SHAPE_LABELS: Record<ShapeKind, string> = {
  triangle: "Triangles",
  square: "Squares",
  pentagon: "Pentagons",
  hexagon: "Hexagons",
  circle: "Circles",
  ellipse: "Ellipses",
  star: "Stars",
  irregular: "Junk",
};
