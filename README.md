# Falling Shapes

My take-home for the Front-end Developer role at Reevo. It's a small PixiJS app written in TypeScript with classes. Shapes fall through a rectangle, you can tap to add or remove them, and two buttons change how fast they spawn and fall.

**Live demo: https://falling-shapes.pages.dev/**

The page opens in **free play**, which is exactly what the brief asks for. There's also an optional 30-second game on top called **Symbol Hunt**, which I added at the end. More on that below.

## Running it

You'll need Node.js 20.19 or newer.

```bash
npm install
npm run dev
```

Then open the address Vite prints (usually http://localhost:5173).

Other commands:

```bash
npm run build     # type-checks with tsc, then builds into dist/
npm run preview   # serves the built version locally
```

To try it on a phone, run `npm run dev -- --host`, make sure the phone is on the same Wi-Fi, and open the "Network" address it prints.

## Things to try

- Watch for a few seconds. A new shape drops in every second, starting just above the board at a random spot.
- Tap an empty spot on the board. A random lumpy shape appears right there and starts falling.
- Tap a shape. It disappears.
- Keep an eye on the two boxes in the top left of the board. They show how many shapes are visible and how much area they cover.
- Use the +/− buttons under the board to change shapes per second (1 to 10) and gravity (0.1 to 2).
- Resize the window, or open it on a phone. The board scales to fit and touch works the same as a mouse.
- Press **Play Symbol Hunt** if you want to see the game.

## Where each part of the brief lives

| Brief | What I did | Main code |
|---|---|---|
| 1 | A 700×500 rectangle inside an 800×600 canvas | `View` |
| 2a–d | Shapes start just above the rectangle at a random x, fall, and get removed once they're fully below it | `Controller.spawnRandomShape`, `Controller.removeOffscreenShapes` |
| 2e | One mask on the container that holds the shapes | `View` |
| 2f | Gravity speeds shapes up every frame | `Shape.update` |
| 2g | One shape per second, using a timer inside the game loop | `Controller.handleSpawning` |
| 2h (bonus) | Random type (3, 4, 5, 6 sides, circle, ellipse, star) and random colour, picked when the shape is created | `ShapeFactory` |
| 3 | Tapping the rectangle adds a shape at that spot | `View.onAreaTap` → `Controller` |
| 3a (bonus) | That shape is a random irregular polygon in a random colour | `IrregularShape` |
| 4 | Tapping a shape removes it | `View.onShapeTap` → `Controller.removeShape` |
| 5a–b | Shape count and surface area in the top left | `Controller.updateStats`, `StatsPanel` |
| 5c (bonus) | Both fields are HTML, laid over the canvas | `index.html`, `StatsPanel` |
| 6a–b (bonus) | +/− buttons for shapes per second and gravity, showing the current value | `index.html`, `ControlsPanel` |
| Mobile | Pointer events, a layout that scales, 48px buttons | `style.css`, `main.ts` |
| Memory | Shapes are cleaned up and their graphics reused | `GraphicsPool`, `Controller.removeShape` |

## How the code is organised

The brief said OOP matters, so I split the app into small classes that each do one job, using Model, View and Controller. Coming from Vue, I think of it like this: the Model is the store, the View is the template, and the Controller is the logic that connects them.

```
src/
├── main.ts                 creates everything and connects it
├── config.ts               game size (800×600)
├── style.css
├── model/
│   ├── Model.ts            gravity, spawn rate, their limits, the list of shapes
│   ├── GameSession.ts      Symbol Hunt rules: timer, target, score, combo
│   └── BestScoreStore.ts   saves the best score in localStorage
├── view/
│   ├── View.ts             the Pixi board: rectangle, mask, shapes, taps
│   ├── Effects.ts          small ink effects when you tap
│   ├── StatsPanel.ts       the two HTML stat boxes
│   ├── ControlsPanel.ts    the HTML +/− buttons
│   ├── GameHud.ts          the bar above the board during Symbol Hunt
│   ├── RoundSummary.ts     the "Time's up" dialog
│   ├── ShapeIcon.ts        the small target icon (SVG)
│   ├── Sections.ts         the accordion sections on the page
│   └── findElement.ts      gets an element by id or throws a clear error
├── controller/
│   ├── Controller.ts       the game loop: move, remove, spawn, update stats, handle taps
│   └── RoundController.ts  runs Symbol Hunt on top of the normal app
└── shapes/
    ├── Shape.ts            abstract base class for every shape
    ├── CircleShape.ts
    ├── EllipseShape.ts
    ├── PolygonShape.ts     abstract: anything made of corner points
    ├── RegularPolygonShape.ts
    ├── StarShape.ts
    ├── IrregularShape.ts
    ├── ShapeFactory.ts     picks a random shape and colour
    ├── ShapeKind.ts        the list of shape types and their names
    ├── geometry.ts         corner points for polygons and stars
    └── GraphicsPool.ts     reuses Pixi Graphics objects
```

### The shapes

```
Shape (abstract)
├── CircleShape
├── EllipseShape
└── PolygonShape (abstract)
    ├── RegularPolygonShape   triangle, square, pentagon, hexagon
    ├── StarShape
    └── IrregularShape
```

`Shape` holds everything shapes have in common: the Pixi graphic, the falling speed, `update()`, the top and bottom edges, and clean-up. Every subclass has to provide `draw()` and `getArea()`.

Triangles, squares, pentagons, hexagons, stars and the irregular shapes are all just a list of corner points. So `PolygonShape` draws them and works out their area once, and each subclass only decides where its corners go.

A shape **has** a Pixi `Graphics` instead of **being** one. That keeps the class small: you can only call the methods I wrote, not the hundreds that `Graphics` comes with.

### One frame of the game loop

Everything runs from Pixi's ticker, in this order:

1. Move every shape (gravity changes its speed, speed changes its position)
2. Remove shapes that are fully below the board
3. Spawn new shapes if the timer says it's time
4. Update the tap effects
5. Recount the visible shapes and their area, and update the HTML only if something changed

The order matters. When spawning came before moving, new shapes got pushed into the board before they were ever drawn, and you could see a thin sliver on their first frame.

### Patterns I used

- **MVC**, to keep data, drawing and logic apart.
- **Factory**: `ShapeFactory` keeps a list of "recipes" and picks one at random. The Controller never imports a specific shape class. Adding a new shape is one more entry in the list.
- **Observer**: views announce events through callbacks (`onAreaTap`, `onShapeTap`, `onGravityChange`...) without knowing who's listening. It's the same idea as `emit` in Vue. The Controller does the same for the game mode, so the core app doesn't know Symbol Hunt exists.
- **Dependency injection**: `main.ts` creates everything and passes it into the classes that need it, so all the wiring is in one place.
- **Object pool**: `GraphicsPool` hands out used Pixi graphics instead of making new ones.

## Decisions I made

The brief left a few things open, so here's how I read them.

- **Which shapes count as "displayed".** Only shapes that are at least partly inside the rectangle. A shape that has just spawned is still above it, and one that has just left is below it, so neither is counted.
- **What "surface area" means.** The real geometric area of each visible shape, added up: πr² for circles, π × a × b for ellipses, and the shoelace formula for anything with corners. I don't subtract overlaps or the part hidden by the mask, because doing that properly means reading pixels back from the GPU every frame, which is too slow on a phone.
- **Where a shape starts.** I create it first, measure it, then place it so its bottom edge sits exactly on the top edge of the rectangle and it fits between the sides. That works for any size and for lopsided shapes like triangles.
- **Irregular shapes.** 5 to 10 corners. I cut the circle into equal slices and put one corner at a random angle inside each slice, at a random distance from the centre. The corners always go round in order, so the edges never cross and the area formula stays correct.
- **Colours.** Random hue, but fixed saturation and lightness (HSL), so every colour is a soft pastel that's easy to see on the white board.
- **Gravity is acceleration.** It changes the speed, and the speed moves the shape, so shapes start slow and speed up. Lowering gravity makes them speed up less from then on, but doesn't slow down shapes that are already falling.
- **Limits.** Gravity goes from 0.1 to 2 and spawn rate from 1 to 10. At gravity 0, new shapes would sit above the board forever and never be removed, which would slowly leak memory. At spawn rate 0, the spawn timer would keep growing and then release a burst of shapes the moment you pressed +. The Model enforces the limits, and the buttons always show the Model's value.

## Performance and memory

- **Nothing piles up.** A shape is removed as soon as it's fully below the board or tapped. It's taken out of the Model's list and the display list, so nothing keeps a reference to it. I checked by logging the count: it stays at 1 or 2 at the default settings instead of growing forever.
- **Graphics get reused.** When a shape is removed, its Pixi `Graphics` is cleared, reset and put back in a pool (up to 50). The next shape takes one from the pool instead of creating a new one. The tap effects use the same pool.
- **Same speed on every device.** Movement uses Pixi's `deltaTime` and the spawn timer uses `deltaMS`, so a phone running at 30fps moves things as fast as a laptop at 60fps. Because the timer is part of the game loop instead of `setInterval`, everything pauses together when the tab is hidden.
- **The page is only touched when needed.** The HTML numbers are written only when a value actually changes, not every frame.
- **Sharp without waste.** The game is always 800×600 inside, but the canvas draws as many pixels as it actually covers on screen (watched with a `ResizeObserver`), with the device pixel ratio capped at 2. A phone draws far fewer pixels than a laptop.
- **One mask** on the shapes container, not one per shape.
- **Cheap checks.** Shape edges come from Pixi's cached local bounds, so checking every shape every frame is cheap.

## Symbol Hunt (optional)

Once everything worked, it felt a bit like a screensaver: you could tap things, but there was no reason to. So I added a short game that gives each feature a job without changing how any of them work.

- You get a shape to find. It changes every 10 seconds, and a round lasts 30 seconds.
- Tapping the right shape scores `10 × combo × bonus`. Each correct tap in a row raises the combo, up to ×5.
- Tapping the wrong shape or an empty spot resets the combo. An empty tap still drops an irregular shape onto the board, so a miss clutters the board.
- More shapes per second and stronger gravity raise the bonus, from ×0.8 up to ×3.6.
- At the end you see your score, hits, accuracy and longest streak. The best score is saved in the browser.

The game lives in its own classes (`GameSession`, `RoundController`, `GameHud`, `RoundSummary`). The original `Controller` only announces taps, so free play works exactly the same with or without it.

## Mobile

- Pointer events handle mouse, touch and pen with the same code. Taps use `pointerdown`, so they register straight away, even on a shape that's moving under your finger.
- The board sizes itself to fit the screen, so the board and its buttons are visible without scrolling on phones and laptops. Pixi maps taps back to game coordinates, so a tap always lands where you touched.
- Buttons are 48px tap targets with `touch-action: manipulation`, so quick double taps don't zoom the page.
- With `prefers-reduced-motion` turned on, effects fade in place instead of moving.

## What I'd do with more time

- **Unit tests** for the Model limits, `GameSession` scoring and the area formulas. They're all plain classes with no Pixi or DOM, so they'd be easy to test.
- **Share drawings between shapes.** Pixi 8 can share one `GraphicsContext` between many `Graphics`, or a shape could be drawn once into a texture and shown with sprites. That would matter with hundreds of shapes on screen. At 1 to 10 per second, the pool is enough.
- **Pass the pool in** instead of using a static class, so it's easier to swap or test.
- **Clip the area to the board** if "surface area" is meant to be only the visible part.

## Built with

- PixiJS 8.22
- TypeScript 6
- Vite 8

No other runtime libraries. The page uses IBM Plex Sans and Plex Mono from Google Fonts, and falls back to system fonts if they don't load.

The live version is hosted on Cloudflare Pages, which runs `npm run build` and serves the `dist/` folder.

## Links

- Live demo: https://falling-shapes.pages.dev/
- Code: https://github.com/JustAlex-WebDev/falling-shapes
- Me on LinkedIn: https://www.linkedin.com/in/alexandar-valov
