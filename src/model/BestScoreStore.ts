export class BestScoreStore {
  private static readonly KEY = "falling-shapes:best-score";

  // Storage can be blocked (private mode, disabled site data), so never let it crash the game.
  public load(): number {
    try {
      const value = Number(localStorage.getItem(BestScoreStore.KEY));
      return Number.isFinite(value) ? value : 0;
    } catch {
      return 0;
    }
  }

  public save(score: number): void {
    try {
      localStorage.setItem(BestScoreStore.KEY, String(score));
    } catch {
      // Ignore: the best score just won't be remembered.
    }
  }
}
