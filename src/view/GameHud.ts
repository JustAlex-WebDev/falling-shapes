import { GAME_HEIGHT, GAME_WIDTH } from "../config";
import { SHAPE_LABELS, type TargetKind } from "../shapes/ShapeKind";
import { findElement } from "./findElement";
import { createShapeIcon } from "./ShapeIcon";

export class GameHud {
  private static readonly URGENT_SECONDS = 5;

  public onPlay?: () => void;

  private readonly idleElement: HTMLElement;
  private readonly roundElement: HTMLElement;
  private readonly targetElement: HTMLElement;
  private readonly targetIconElement: HTMLElement;
  private readonly targetNameElement: HTMLElement;
  private readonly timeElement: HTMLElement;
  private readonly scoreElement: HTMLElement;
  private readonly comboElement: HTMLElement;
  private readonly bonusElement: HTMLElement;
  private readonly feedbackLayer: HTMLElement;
  private shownTarget: TargetKind | null = null;

  constructor() {
    this.idleElement = findElement("hud-idle");
    this.roundElement = findElement("hud-round");
    this.targetElement = findElement("hud-target");
    this.targetIconElement = findElement("hud-target-icon");
    this.targetNameElement = findElement("hud-target-name");
    this.timeElement = findElement("hud-time");
    this.scoreElement = findElement("hud-score");
    this.comboElement = findElement("hud-combo");
    this.bonusElement = findElement("hud-bonus");
    this.feedbackLayer = findElement("feedback");

    findElement("play-button").addEventListener("click", () => this.onPlay?.());
  }

  public showIdle(): void {
    this.idleElement.hidden = false;
    this.roundElement.hidden = true;
    this.shownTarget = null;
  }

  public showRound(): void {
    this.idleElement.hidden = true;
    this.roundElement.hidden = false;
  }

  public setTarget(kind: TargetKind): void {
    if (kind === this.shownTarget) return;
    this.shownTarget = kind;
    this.targetIconElement.replaceChildren(createShapeIcon(kind));
    this.targetNameElement.textContent = SHAPE_LABELS[kind];

    // A soft highlight, like a marker pen, so a new target is noticed.
    this.targetElement.animate(
      [{ backgroundColor: "#ffe873" }, { backgroundColor: "transparent" }],
      { duration: 900, easing: "ease-out" },
    );
  }

  public update(secondsLeft: number, score: number, combo: number, bonus: number): void {
    this.setText(this.timeElement, `${secondsLeft}s`);
    this.setText(this.scoreElement, score.toLocaleString("en-US"));
    this.setText(this.comboElement, `×${combo}`);
    this.setText(this.bonusElement, `×${bonus.toFixed(1)}`);
    this.timeElement.classList.toggle("is-urgent", secondsLeft <= GameHud.URGENT_SECONDS);
  }

  public showPoints(x: number, y: number, points: number): void {
    const element = document.createElement("span");
    element.className = "feedback__points";
    element.textContent = `+${points}`;
    element.style.left = `${(x / GAME_WIDTH) * 100}%`;
    element.style.top = `${(y / GAME_HEIGHT) * 100}%`;
    element.addEventListener("animationend", () => element.remove(), { once: true });
    this.feedbackLayer.append(element);
  }

  private setText(element: HTMLElement, text: string): void {
    if (element.textContent !== text) element.textContent = text;
  }
}
