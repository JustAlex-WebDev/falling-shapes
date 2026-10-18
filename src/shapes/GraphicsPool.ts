import { Graphics } from "pixi.js";

export class GraphicsPool {
  private static readonly MAX_SIZE = 50;
  private static readonly pool: Graphics[] = [];

  public static acquire(): Graphics {
    return GraphicsPool.pool.pop() ?? new Graphics();
  }

  public static release(graphics: Graphics): void {
    graphics.removeAllListeners();
    graphics.clear();
    graphics.position.set(0, 0);
    graphics.scale.set(1);
    graphics.rotation = 0;
    graphics.alpha = 1;

    if (GraphicsPool.pool.length < GraphicsPool.MAX_SIZE) {
      GraphicsPool.pool.push(graphics);
    } else {
      graphics.destroy();
    }
  }
}
