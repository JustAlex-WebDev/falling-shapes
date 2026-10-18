import type { Direction } from "../model/Model";
import { findElement } from "./findElement";

export class ControlsPanel {
  public onSpawnRateChange?: (direction: Direction) => void;
  public onGravityChange?: (direction: Direction) => void;

  private readonly spawnRateElement: HTMLElement;
  private readonly gravityElement: HTMLElement;

  constructor() {
    this.spawnRateElement = findElement("spawn-rate-value");
    this.gravityElement = findElement("gravity-value");

    findElement("spawn-rate-minus").addEventListener("click", () =>
      this.onSpawnRateChange?.(-1),
    );
    findElement("spawn-rate-plus").addEventListener("click", () =>
      this.onSpawnRateChange?.(1),
    );
    findElement("gravity-minus").addEventListener("click", () =>
      this.onGravityChange?.(-1),
    );
    findElement("gravity-plus").addEventListener("click", () =>
      this.onGravityChange?.(1),
    );
  }

  public update(spawnRate: number, gravity: number): void {
    this.spawnRateElement.textContent = String(spawnRate);
    this.gravityElement.textContent = gravity.toFixed(1);
  }
}
