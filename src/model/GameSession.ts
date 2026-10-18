import { TARGET_KINDS, type ShapeKind, type TargetKind } from "../shapes/ShapeKind";

export type TapResult =
  | { type: "hit"; points: number }
  | { type: "wrong" }
  | { type: "junk" };

export class GameSession {
  private static readonly ROUND_MS = 30_000;
  private static readonly TARGET_MS = 10_000;
  private static readonly BASE_POINTS = 10;
  private static readonly MAX_COMBO = 5;

  private running = false;
  private timeLeftMs = 0;
  private targetTimeLeftMs = 0;
  private currentTarget: TargetKind = "star";
  private currentScore = 0;
  private streak = 0;
  private longestStreak = 0;
  private hitCount = 0;
  private mistakeCount = 0;

  public static difficulty(gravity: number, spawnRate: number): number {
    const bonus = 1 + (spawnRate - 1) * 0.1 + (gravity - 0.3);
    return Math.round(bonus * 10) / 10;
  }

  public get isRunning(): boolean {
    return this.running;
  }

  public get secondsLeft(): number {
    return Math.ceil(this.timeLeftMs / 1000);
  }

  public get target(): TargetKind {
    return this.currentTarget;
  }

  public get score(): number {
    return this.currentScore;
  }

  public get combo(): number {
    return Math.min(1 + this.streak, GameSession.MAX_COMBO);
  }

  public get bestStreak(): number {
    return this.longestStreak;
  }

  public get hits(): number {
    return this.hitCount;
  }

  public get accuracy(): number {
    const attempts = this.hitCount + this.mistakeCount;
    return attempts === 0 ? 0 : Math.round((this.hitCount / attempts) * 100);
  }

  public start(): void {
    this.running = true;
    this.timeLeftMs = GameSession.ROUND_MS;
    this.targetTimeLeftMs = GameSession.TARGET_MS;
    this.currentScore = 0;
    this.streak = 0;
    this.longestStreak = 0;
    this.hitCount = 0;
    this.mistakeCount = 0;
    this.pickNewTarget();
  }

  public update(deltaMS: number): void {
    if (!this.running) return;

    this.timeLeftMs -= deltaMS;
    if (this.timeLeftMs <= 0) {
      this.timeLeftMs = 0;
      this.running = false;
      return;
    }

    this.targetTimeLeftMs -= deltaMS;
    if (this.targetTimeLeftMs <= 0) {
      this.targetTimeLeftMs += GameSession.TARGET_MS;
      this.pickNewTarget();
    }
  }

  public registerShapeTap(kind: ShapeKind, difficulty: number): TapResult {
    if (kind === "irregular") return { type: "junk" };

    if (kind !== this.currentTarget) {
      this.registerMistake();
      return { type: "wrong" };
    }

    const points = Math.round(GameSession.BASE_POINTS * this.combo * difficulty);
    this.currentScore += points;
    this.hitCount++;
    this.streak++;
    this.longestStreak = Math.max(this.longestStreak, this.streak);
    return { type: "hit", points };
  }

  public registerMiss(): void {
    this.registerMistake();
  }

  private registerMistake(): void {
    this.mistakeCount++;
    this.streak = 0;
  }

  private pickNewTarget(): void {
    const options = TARGET_KINDS.filter((kind) => kind !== this.currentTarget);
    this.currentTarget = options[Math.floor(Math.random() * options.length)];
  }
}
