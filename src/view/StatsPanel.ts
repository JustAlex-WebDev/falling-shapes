import { findElement } from "./findElement";

export class StatsPanel {
  private readonly countElement: HTMLElement;
  private readonly areaElement: HTMLElement;

  constructor() {
    this.countElement = findElement("shape-count");
    this.areaElement = findElement("shape-area");
  }

  public update(count: number, area: number): void {
    this.countElement.textContent = String(count);
    this.areaElement.textContent = area.toLocaleString("en-US");
  }
}
