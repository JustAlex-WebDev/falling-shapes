import type { Ticker } from "pixi.js";
import type { Model } from "../model/Model";
import type { View } from "../view/View";
import type { ShapeFactory } from "../shapes/ShapeFactory";
import type { Shape } from "../shapes/Shape";
import type { StatsPanel } from "../view/StatsPanel";
import type { ControlsPanel } from "../view/ControlsPanel";

export class Controller {
  private readonly model: Model;
  private readonly view: View;
  private readonly shapeFactory: ShapeFactory;
  private spawnTimer = 0;
  private lastCount = -1;
  private lastArea = -1;
  private readonly statsPanel: StatsPanel;
  private readonly controlsPanel: ControlsPanel;
  public onShapeTapped?: (shape: Shape, x: number, y: number) => void;
  public onEmptyTapped?: (x: number, y: number) => void;

  constructor(
    model: Model,
    view: View,
    statsPanel: StatsPanel,
    controlsPanel: ControlsPanel,
    shapeFactory: ShapeFactory,
    ticker: Ticker,
  ) {
    this.model = model;
    this.view = view;
    this.statsPanel = statsPanel;
    this.controlsPanel = controlsPanel;
    this.shapeFactory = shapeFactory;
    view.onAreaTap = (x, y) => {
      this.view.effects.ring(x, y);
      this.addShape(this.shapeFactory.createIrregularShape(x, y));
      this.onEmptyTapped?.(x, y);
    };
    view.onShapeTap = (shape, x, y) => {
      this.view.effects.burst(x, y);
      this.onShapeTapped?.(shape, x, y);
      this.removeShape(shape);
    };

    controlsPanel.onSpawnRateChange = (direction) => {
      this.model.changeSpawnRate(direction);
      this.refreshControls();
    };
    controlsPanel.onGravityChange = (direction) => {
      this.model.changeGravity(direction);
      this.refreshControls();
    };
    this.refreshControls();

    ticker.add((t) => {
      this.updateShapes(t.deltaTime);
      this.removeOffscreenShapes();
      this.handleSpawning(t.deltaMS);
      this.view.effects.update(t.deltaMS);
      this.updateStats();
    });
  }

  private refreshControls(): void {
    this.controlsPanel.update(this.model.spawnRate, this.model.gravity);
  }

  private updateShapes(deltaTime: number): void {
    for (const shape of this.model.shapes) {
      shape.update(this.model.gravity, deltaTime);
    }
  }

  private addShape(shape: Shape): void {
    this.model.addShape(shape);
    this.view.addShape(shape);
  }

  private removeShape(shape: Shape): void {
    this.model.removeShape(shape);
    this.view.removeShape(shape);
    shape.destroy();
  }

  private spawnRandomShape(): void {
    const shape = this.shapeFactory.createRandomShape(0, 0);
    const { left, top, width } = this.view.bounds;
    const shapeBounds = shape.localBounds;

    const x =
      left - shapeBounds.minX + Math.random() * (width - shapeBounds.width);
    const y = top - shapeBounds.maxY;

    shape.moveTo(x, y);
    this.addShape(shape);
  }

  private handleSpawning(deltaMS: number): void {
    this.spawnTimer += deltaMS;
    const spawnInterval = 1000 / this.model.spawnRate;

    while (this.spawnTimer >= spawnInterval) {
      this.spawnTimer -= spawnInterval;
      this.spawnRandomShape();
    }
  }

  private removeOffscreenShapes(): void {
    const bottom = this.view.bounds.bottom;
    const shapes = this.model.shapes;

    for (let i = shapes.length - 1; i >= 0; i--) {
      if (shapes[i].top > bottom) {
        this.removeShape(shapes[i]);
      }
    }
  }

  private updateStats(): void {
    const { top, bottom } = this.view.bounds;
    let count = 0;
    let area = 0;

    for (const shape of this.model.shapes) {
      if (shape.bottom > top && shape.top < bottom) {
        count++;
        area += shape.getArea();
      }
    }

    const roundedArea = Math.round(area);
    if (count !== this.lastCount || roundedArea !== this.lastArea) {
      this.lastCount = count;
      this.lastArea = roundedArea;
      this.statsPanel.update(count, roundedArea);
    }
  }
}
