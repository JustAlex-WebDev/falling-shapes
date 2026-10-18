import { Container, type Graphics } from "pixi.js";
import { GraphicsPool } from "../shapes/GraphicsPool";

type DrawFrame = (graphics: Graphics, progress: number) => void;

interface ActiveEffect {
  graphics: Graphics;
  age: number;
  duration: number;
  drawFrame: DrawFrame;
}

export class Effects {
  private static readonly INK = 0x18212f;
  private static readonly ALERT = 0xd93b4c;

  public readonly container = new Container();
  private readonly active: ActiveEffect[] = [];
  private readonly reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  // Short ink strokes flying out from where a shape was removed.
  // Each stroke gets a slightly different angle and length so it looks hand-drawn.
  public burst(x: number, y: number): void {
    const strokes = Array.from({ length: 7 }, (_, i) => ({
      angle: (i / 7) * Math.PI * 2 + (Math.random() - 0.5) * 0.5,
      length: 6 + Math.random() * 6,
    }));

    this.add(x, y, 380, (graphics, progress) => {
      const distance = 10 + 14 * this.ease(progress);
      for (const stroke of strokes) {
        const cos = Math.cos(stroke.angle);
        const sin = Math.sin(stroke.angle);
        const length = stroke.length * (1 - progress);
        graphics
          .moveTo(cos * distance, sin * distance)
          .lineTo(cos * (distance + length), sin * (distance + length));
      }
      graphics.stroke({ width: 2, color: Effects.INK, alpha: 1 - progress, cap: "round" });
    });
  }

  // A thin ring marking where the board was tapped.
  public ring(x: number, y: number): void {
    this.add(x, y, 420, (graphics, progress) => {
      graphics
        .circle(0, 0, 4 + 16 * this.ease(progress))
        .stroke({ width: 1.5, color: Effects.INK, alpha: 0.8 * (1 - progress) });
    });
  }

  // A small cross for a wrong tap in Symbol Hunt.
  public cross(x: number, y: number): void {
    this.add(x, y, 450, (graphics, progress) => {
      const size = 7;
      graphics
        .moveTo(-size, -size)
        .lineTo(size, size)
        .moveTo(size, -size)
        .lineTo(-size, size)
        .stroke({ width: 3, color: Effects.ALERT, alpha: 1 - progress * progress, cap: "round" });
    });
  }

  public update(deltaMS: number): void {
    for (let i = this.active.length - 1; i >= 0; i--) {
      const effect = this.active[i];
      effect.age += deltaMS;
      const progress = Math.min(effect.age / effect.duration, 1);

      effect.graphics.clear();
      effect.drawFrame(effect.graphics, progress);

      if (progress >= 1) {
        this.container.removeChild(effect.graphics);
        GraphicsPool.release(effect.graphics);
        this.active.splice(i, 1);
      }
    }
  }

  private add(x: number, y: number, duration: number, drawFrame: DrawFrame): void {
    const graphics = GraphicsPool.acquire();
    graphics.eventMode = "none";
    graphics.position.set(x, y);
    drawFrame(graphics, 0);
    this.container.addChild(graphics);
    this.active.push({ graphics, age: 0, duration, drawFrame });
  }

  // Fast at the start, gentle at the end. With reduced motion, skip the movement entirely.
  private ease(progress: number): number {
    if (this.reducedMotion.matches) return 1;
    return 1 - (1 - progress) ** 3;
  }
}
