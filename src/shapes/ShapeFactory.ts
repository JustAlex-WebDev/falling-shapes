import { Color } from "pixi.js";
import type { Shape } from "./Shape";
import type { TargetKind } from "./ShapeKind";
import { CircleShape } from "./CircleShape";
import { EllipseShape } from "./EllipseShape";
import { IrregularShape } from "./IrregularShape";
import { RegularPolygonShape } from "./RegularPolygonShape";
import { StarShape } from "./StarShape";

interface ShapeRecipe {
  kind: TargetKind;
  create: (x: number, y: number, color: number, size: number) => Shape;
}

export class ShapeFactory {
  private static readonly FAVOURED_CHANCE = 0.35;

  public favouredKind: TargetKind | null = null;

  private readonly recipes: ShapeRecipe[] = [
    {
      kind: "triangle",
      create: (x, y, color, size) =>
        new RegularPolygonShape(x, y, color, "triangle", size),
    },
    {
      kind: "square",
      create: (x, y, color, size) =>
        new RegularPolygonShape(x, y, color, "square", size),
    },
    {
      kind: "pentagon",
      create: (x, y, color, size) =>
        new RegularPolygonShape(x, y, color, "pentagon", size),
    },
    {
      kind: "hexagon",
      create: (x, y, color, size) =>
        new RegularPolygonShape(x, y, color, "hexagon", size),
    },
    {
      kind: "circle",
      create: (x, y, color, size) => new CircleShape(x, y, color, size),
    },
    {
      kind: "ellipse",
      create: (x, y, color, size) =>
        new EllipseShape(x, y, color, size, size * 0.6),
    },
    {
      kind: "star",
      create: (x, y, color, size) =>
        new StarShape(x, y, color, 5, size, size * 0.5),
    },
  ];

  public createRandomShape(x: number, y: number): Shape {
    const size = this.randomBetween(20, 40);
    return this.pickRecipe().create(x, y, this.randomColor(), size);
  }

  public createIrregularShape(x: number, y: number): Shape {
    return new IrregularShape(x, y, this.randomColor(), 20, 45);
  }

  private pickRecipe(): ShapeRecipe {
    if (this.favouredKind && Math.random() < ShapeFactory.FAVOURED_CHANCE) {
      const favoured = this.recipes.find((r) => r.kind === this.favouredKind);
      if (favoured) return favoured;
    }
    return this.recipes[Math.floor(Math.random() * this.recipes.length)];
  }

  private randomColor(): number {
    return new Color({ h: Math.random() * 360, s: 65, l: 70 }).toNumber();
  }

  private randomBetween(min: number, max: number): number {
    return min + Math.random() * (max - min);
  }
}
