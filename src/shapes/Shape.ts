import type { Bounds, Graphics } from "pixi.js";
import { GraphicsPool } from "./GraphicsPool";
import type { ShapeKind } from "./ShapeKind";

export abstract class Shape {
  private static readonly OUTLINE = { width: 1.5, color: 0x18212f };

  public readonly kind: ShapeKind;
  public readonly graphics: Graphics;
  protected color: number;
  private velocityY = 0;

  constructor(kind: ShapeKind, x: number, y: number, color: number) {
    this.kind = kind;
    this.color = color;
    this.graphics = GraphicsPool.acquire();
    this.graphics.position.set(x, y);
  }

  protected abstract draw(): void;
  public abstract getArea(): number;

  protected paint(): void {
    this.graphics.fill(this.color).stroke(Shape.OUTLINE);
  }

  public update(gravity: number, deltaTime: number): void {
    this.velocityY += gravity * deltaTime;
    this.graphics.y += this.velocityY * deltaTime;
  }

  public get top(): number {
    return this.graphics.y + this.graphics.bounds.minY;
  }

  public get bottom(): number {
    return this.graphics.y + this.graphics.bounds.maxY;
  }

  public get localBounds(): Bounds {
    return this.graphics.bounds;
  }

  public moveTo(x: number, y: number): void {
    this.graphics.position.set(x, y);
  }

  public destroy(): void {
    GraphicsPool.release(this.graphics);
  }
}
