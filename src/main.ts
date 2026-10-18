import { Application } from "pixi.js";
import { GAME_HEIGHT, GAME_WIDTH } from "./config";
import { Controller } from "./controller/Controller";
import { RoundController } from "./controller/RoundController";
import { BestScoreStore } from "./model/BestScoreStore";
import { GameSession } from "./model/GameSession";
import { Model } from "./model/Model";
import { ShapeFactory } from "./shapes/ShapeFactory";
import { ControlsPanel } from "./view/ControlsPanel";
import { findElement } from "./view/findElement";
import { GameHud } from "./view/GameHud";
import { PageLoader } from "./view/PageLoader";
import { RoundSummary } from "./view/RoundSummary";
import { Sections } from "./view/Sections";
import { StatsPanel } from "./view/StatsPanel";
import { View } from "./view/View";

// How many real pixels to draw per game pixel: enough to match the board's size
// on screen (so it's sharp), with the device pixel ratio capped at 2.
function resolutionFor(container: HTMLElement): number {
  const scale = container.clientWidth / GAME_WIDTH;
  return Math.min(window.devicePixelRatio, 2) * scale;
}

async function main() {
  new Sections();

  const container = findElement("app");
  const app = new Application();
  await app.init({
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundAlpha: 0,
    antialias: true,
    resolution: resolutionFor(container),
  });

  container.appendChild(app.canvas);

  // The game stays 800×600 inside; only the pixel density follows the screen size.
  new ResizeObserver(() => {
    const resolution = resolutionFor(container);
    if (Math.abs(resolution - app.renderer.resolution) > 0.01) {
      app.renderer.resize(GAME_WIDTH, GAME_HEIGHT, resolution);
    }
  }).observe(container);

  const model = new Model();
  const view = new View(app.stage);
  const statsPanel = new StatsPanel();
  const shapeFactory = new ShapeFactory();
  const controlsPanel = new ControlsPanel();

  const controller = new Controller(
    model,
    view,
    statsPanel,
    controlsPanel,
    shapeFactory,
    app.ticker,
  );

  new RoundController({
    session: new GameSession(),
    model,
    shapeFactory,
    controller,
    hud: new GameHud(),
    effects: view.effects,
    summary: new RoundSummary(),
    bestScores: new BestScoreStore(),
    ticker: app.ticker,
  });
}

// Hide the loader once the app is ready. `finally` also hides it if something
// fails, so the page is never stuck behind a spinner.
const loader = new PageLoader();
main().finally(() => loader.hide());
