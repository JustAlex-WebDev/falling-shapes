import { findElement } from "./findElement";

export class PageLoader {
  private static readonly MAX_FONT_WAIT_MS = 1500;

  private readonly element: HTMLElement;

  constructor() {
    this.element = findElement("loader");
  }

  // Wait for the web fonts so the text doesn't jump when they arrive,
  // but never longer than 1.5s. Then fade the loader out and remove it.
  public async hide(): Promise<void> {
    await Promise.race([document.fonts.ready, this.wait(PageLoader.MAX_FONT_WAIT_MS)]);

    document.documentElement.classList.remove("is-loading");
    this.element.classList.add("is-hidden");
    this.element.addEventListener("transitionend", () => this.element.remove(), { once: true });
  }

  private wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
