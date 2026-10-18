import type { Ticker } from "pixi.js";
import type { Controller } from "./Controller";
import type { Model } from "../model/Model";
import type { BestScoreStore } from "../model/BestScoreStore";
import { GameSession } from "../model/GameSession";
import type { ShapeFactory } from "../shapes/ShapeFactory";
import type { ShapeKind } from "../shapes/ShapeKind";
import type { Effects } from "../view/Effects";
import type { GameHud } from "../view/GameHud";
import type { RoundSummary } from "../view/RoundSummary";

export interface RoundControllerOptions {
  session: GameSession;
  model: Model;
  shapeFactory: ShapeFactory;
  controller: Controller;
  hud: GameHud;
  effects: Effects;
  summary: RoundSummary;
  bestScores: BestScoreStore;
  ticker: Ticker;
}

export class RoundController {
  private readonly session: GameSession;
  private readonly model: Model;
  private readonly shapeFactory: ShapeFactory;
  private readonly hud: GameHud;
  private readonly effects: Effects;
  private readonly summary: RoundSummary;
  private readonly bestScores: BestScoreStore;

  constructor(options: RoundControllerOptions) {
    this.session = options.session;
    this.model = options.model;
    this.shapeFactory = options.shapeFactory;
    this.hud = options.hud;
    this.effects = options.effects;
    this.summary = options.summary;
    this.bestScores = options.bestScores;

    this.hud.onPlay = () => this.startRound();
    this.summary.onPlayAgain = () => this.startRound();
    options.controller.onShapeTapped = (shape, x, y) =>
      this.handleShapeTap(shape.kind, x, y);
    options.controller.onEmptyTapped = () => this.handleMiss();
    options.ticker.add((t) => this.update(t.deltaMS));
  }

  private get difficulty(): number {
    return GameSession.difficulty(this.model.gravity, this.model.spawnRate);
  }

  private startRound(): void {
    this.session.start();
    this.hud.showRound();
    this.syncTarget();
    this.refreshHud();
  }

  private update(deltaMS: number): void {
    if (!this.session.isRunning) return;

    this.session.update(deltaMS);
    if (!this.session.isRunning) {
      this.endRound();
      return;
    }

    this.syncTarget();
    this.refreshHud();
  }

  private handleShapeTap(kind: ShapeKind, x: number, y: number): void {
    if (!this.session.isRunning) return;

    const result = this.session.registerShapeTap(kind, this.difficulty);
    if (result.type === "hit") {
      this.hud.showPoints(x, y, result.points);
    } else if (result.type === "wrong") {
      this.effects.cross(x, y);
    }
    this.refreshHud();
  }

  private handleMiss(): void {
    if (!this.session.isRunning) return;

    this.session.registerMiss();
    this.refreshHud();
  }

  private syncTarget(): void {
    this.shapeFactory.favouredKind = this.session.target;
    this.hud.setTarget(this.session.target);
  }

  private refreshHud(): void {
    const { secondsLeft, score, combo } = this.session;
    this.hud.update(secondsLeft, score, combo, this.difficulty);
  }

  private endRound(): void {
    this.shapeFactory.favouredKind = null;
    this.hud.showIdle();

    const previousBest = this.bestScores.load();
    const isNewBest = this.session.score > previousBest;
    if (isNewBest) this.bestScores.save(this.session.score);

    this.summary.show({
      score: this.session.score,
      hits: this.session.hits,
      accuracy: this.session.accuracy,
      bestStreak: this.session.bestStreak,
      bestScore: Math.max(previousBest, this.session.score),
      isNewBest,
    });
  }
}
