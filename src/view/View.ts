import { Container, Graphics, Rectangle } from "pixi.js";
import type { Shape } from "../shapes/Shape";
import { Effects } from "./Effects";

export class View {
  private static readonly AREA_COLOR = 0xffffff;
  private static readonly FRAME = { width: 1.5, color: 0x18212f };

  public readonly bounds = new Rectangle(50, 50, 700, 500);
  public readonly effects = new Effects();
  private readonly shapesContainer: Container;
  public onAreaTap?: (x: number, y: number) => void;
  public onShapeTap?: (shape: Shape, x: number, y: number) => void;

  constructor(stage: Container) {
    const { x, y, width, height } = this.bounds;

    const area = new Graphics().rect(x, y, width, height).fill(View.AREA_COLOR);
    const playfield = new Container();
    this.shapesContainer = new Container();
    const frame = new Graphics().rect(x, y, width, height).stroke(View.FRAME);
    const mask = new Graphics().rect(x, y, width, height).fill(0xffffff);

    playfield.addChild(this.shapesContainer);
    playfield.addChild(this.effects.container);

    stage.addChild(area);
    stage.addChild(playfield);
    stage.addChild(frame);
    stage.addChild(mask);
    playfield.mask = mask;

    area.eventMode = "static";
    area.on("pointerdown", (event) => {
      const position = event.getLocalPosition(this.shapesContainer);
      this.onAreaTap?.(position.x, position.y);
    });
  }

  public addShape(shape: Shape): void {
    const graphics = shape.graphics;
    graphics.eventMode = "static";
    graphics.cursor = "pointer";
    graphics.on("pointerdown", (event) => {
      const position = event.getLocalPosition(this.shapesContainer);
      this.onShapeTap?.(shape, position.x, position.y);
    });
    this.shapesContainer.addChild(graphics);
  }

  public removeShape(shape: Shape): void {
    this.shapesContainer.removeChild(shape.graphics);
  }
}
