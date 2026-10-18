import type { Shape } from "../shapes/Shape";

export type Direction = 1 | -1;

export class Model {
  private static readonly GRAVITY_STEP = 0.1;
  private static readonly MIN_GRAVITY = 0.1;
  private static readonly MAX_GRAVITY = 2;
  private static readonly MIN_SPAWN_RATE = 1;
  private static readonly MAX_SPAWN_RATE = 10;

  private gravityValue = 0.3;
  private spawnRateValue = 1;
  public readonly shapes: Shape[] = [];

  public get gravity(): number {
    return this.gravityValue;
  }

  public get spawnRate(): number {
    return this.spawnRateValue;
  }

  public changeGravity(direction: Direction): void {
    const next = this.gravityValue + direction * Model.GRAVITY_STEP;
    const rounded = Math.round(next * 10) / 10;
    this.gravityValue = this.clamp(
      rounded,
      Model.MIN_GRAVITY,
      Model.MAX_GRAVITY,
    );
  }

  public changeSpawnRate(direction: Direction): void {
    const next = this.spawnRateValue + direction;
    this.spawnRateValue = this.clamp(
      next,
      Model.MIN_SPAWN_RATE,
      Model.MAX_SPAWN_RATE,
    );
  }

  public addShape(shape: Shape): void {
    this.shapes.push(shape);
  }

  public removeShape(shape: Shape): void {
    const index = this.shapes.indexOf(shape);
    if (index !== -1) {
      this.shapes.splice(index, 1);
    }
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }
}
