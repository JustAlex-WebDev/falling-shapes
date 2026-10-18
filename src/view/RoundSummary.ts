import { findElement } from "./findElement";

export interface RoundResult {
  score: number;
  hits: number;
  accuracy: number;
  bestStreak: number;
  bestScore: number;
  isNewBest: boolean;
}

export class RoundSummary {
  private static readonly PLAY_AGAIN = "again";

  public onPlayAgain?: () => void;

  private readonly dialog: HTMLDialogElement;
  private readonly badgeElement: HTMLElement;
  private readonly scoreElement: HTMLElement;
  private readonly hitsElement: HTMLElement;
  private readonly accuracyElement: HTMLElement;
  private readonly streakElement: HTMLElement;
  private readonly bestElement: HTMLElement;

  constructor() {
    const dialog = findElement("round-summary");
    if (!(dialog instanceof HTMLDialogElement)) {
      throw new Error("#round-summary must be a <dialog>");
    }
    this.dialog = dialog;
    this.badgeElement = findElement("summary-badge");
    this.scoreElement = findElement("summary-score");
    this.hitsElement = findElement("summary-hits");
    this.accuracyElement = findElement("summary-accuracy");
    this.streakElement = findElement("summary-streak");
    this.bestElement = findElement("summary-best");

    findElement("summary-again").addEventListener("click", () =>
      this.dialog.close(RoundSummary.PLAY_AGAIN),
    );
    findElement("summary-close").addEventListener("click", () => this.dialog.close());
    this.dialog.addEventListener("close", () => {
      if (this.dialog.returnValue === RoundSummary.PLAY_AGAIN) this.onPlayAgain?.();
    });
  }

  public show(result: RoundResult): void {
    this.badgeElement.hidden = !result.isNewBest;
    this.scoreElement.textContent = result.score.toLocaleString("en-US");
    this.hitsElement.textContent = String(result.hits);
    this.accuracyElement.textContent = `${result.accuracy}%`;
    this.streakElement.textContent = String(result.bestStreak);
    this.bestElement.textContent = result.bestScore.toLocaleString("en-US");
    this.dialog.returnValue = "";
    this.dialog.showModal();
  }
}
