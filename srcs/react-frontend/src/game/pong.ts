import * as PIXI from "pixi.js";
import { io } from "socket.io-client";

import addKeyListeners from "./shared/util/Interaction";

import BallDrawable from "./graphics/BallDrawable";
import PaddleDrawable from "./graphics/PaddleDrawable";
import WallDrawable from "./graphics/WallDrawable";
import { GraphicalDebugger } from "./graphics/Debug";
import Game, { GameEvents } from "./shared/util/Game";
import { GameStateMachine } from "./shared/util/state/GameStateMachine";
import ScoreBoardDrawable from "./graphics/ScoreBoardDrawable";
import WhaffHUD from "./graphics/WhaffHUD";

let app: PIXI.Application;

declare global {
  var debugMode: boolean;
  var debugTool: GraphicalDebugger;
}

let game_starting_for_good = false;

export function gameSetup(instantiatedApp: PIXI.Application) {
  if (!game_starting_for_good) {
    //Hacky way to avoid running this twice, should be fixed in the future
    game_starting_for_good = true;
    return;
  }
  // fetch("http://localhost:3000").then((s) => console.log(s));
  const socket = io(`${window.location.origin}:3000/game`, {
    query: { name: "Jhon", roomID: null, premade: false, spectator: false },
  });
  let debugInfo = {
    pings: {},
  };
  socket.on("gameUpdate", (gameState: any) => {
    if (!controlable.includes("player1")) {
      game.paddle1.target.x = gameState.p1.target.x;
      game.paddle1.target.y = gameState.p1.target.y;
    }
    if (!controlable.includes("player2")) {
      game.paddle2.target.x = gameState.p2.target.x;
      game.paddle2.target.y = gameState.p2.target.y;
    }
    game.ball.pos.x = gameState.ballpos.x;
    game.ball.pos.y = gameState.ballpos.y;
    game.ball.velocity.x = gameState.ballvel.x;
    game.ball.velocity.y = gameState.ballvel.y;
    game.scoreboard.left = gameState.score.left;
    game.scoreboard.right = gameState.score.right;
    socket.emit("pingBack", { time: gameState.time });
    debugInfo.pings = gameState.pings;
  });
  socket.on("assignController", (settings) => {
    console.log(settings);
    controlable = settings.control;
  });

  let controlable: string[] = [];
  app = instantiatedApp;

  const game = new Game();
  /*DRAWABLES */
  const p1 = new PaddleDrawable(game.paddle1, app);
  const p2 = new PaddleDrawable(game.paddle2, app);
  const players = {
    player1: game.paddle1,
    player2: game.paddle2,
  };
  const ball = new BallDrawable(game.ball, app);
  game.walls.forEach((w) => new WallDrawable(w, app));
  new WallDrawable(game.leftGoal, app, 0x00ffff);
  new WallDrawable(game.rightGoal, app, 0x00ffff);
  /* DRAWABLES */

  app.stage.interactive = true;
  app.stage.on("pointermove", (e) => {
    const pos = e.data.global;
    for (const pKey of controlable) {
      const p = players[pKey as keyof typeof players];
      p.target = pos;
    }
  });
  addKeyListeners("w").press = () => (game.paddle1.phi += 0.05);
  addKeyListeners("s").press = () => (game.paddle1.phi -= 0.05);
  addKeyListeners("o").press = () => (game.paddle2.phi += 0.05);
  addKeyListeners("l").press = () => (game.paddle2.phi -= 0.05);

  const i_listener = addKeyListeners("i");
  i_listener.press = () => {
    globalThis.debugMode = !globalThis.debugMode;
  };
  globalThis.debugMode = false;
  globalThis.debugTool = new GraphicalDebugger(app);

  console.log("Finished Game setup");

  const hud = new WhaffHUD(app, game, debugInfo);
  // HUD(game, app);

  game.on(GameEvents.GameUpdate, (frame: number) => {
    if (frame % 6 == 0) {
      for (const pkey of controlable) {
        const p = players[pkey as keyof typeof players];
        socket.emit("inputUpdate", {
          target: { x: p.target.x, y: p.target.y },
        });
      }
    }
  });

  game_starting_for_good = true;
  let t = performance.now();
  let elapsed = t;
  // function coms() {
  //   const dt = performance.now() - t;
  //   t = performance.now();
  //   if (t - elapsed > 30) {
  //     // console.log(t - elapsed);

  //     elapsed = t;
  //     const send = {
  //       time: t,
  //       p1: { target: {x: game.paddle1.target.x, y: game.paddle1.target.y}},
  //       p2: { target: {x: game.paddle2.target.x, y: game.paddle2.target.y}},
  //       ballpos: { x: game.ball.pos.x, y: game.ball.pos.y },
  //       ballvel: { x: game.ball.velocity.x, y: game.ball.velocity.y },
  //     };
  //     socket.emit("gameUpdate", send);
  //     socket.emit("ping", {t: performance.now()});
  //   }
  //   setTimeout(() => coms(), 10);
  // }
  // requestAnimationFrame(() => coms());
  // PIXI.Ticker.shared.add((delta) => {
  //   elapsed += delta / 60;
  //   if (elapsed > 0.03) {
  //     // console.log(elapsed);

  //     elapsed = 0;
  //     const send = {
  //       p1: { phi: p.phi },
  //       p2: { phi: p2.phi },
  //       ballpos: { x: ball.pos.x, y: ball.pos.y },
  //       ballvel: { x: ball.velocity.x, y: ball.velocity.y },
  //       ball: ball,
  //       name: "etie"
  //     };
  //     socket.emit("gameUpdate", send);
  //   }
  // });
  const gameStateMachine = new GameStateMachine(game);
}

function HUD(game: Game, app: PIXI.Application) {
  const scoreBoard = new ScoreBoardDrawable(game.scoreboard, app);
  scoreBoard.textGfx.anchor.x = 0.5;
  scoreBoard.textGfx.x = Game.width / 2;
  scoreBoard.textGfx.y = 30;
}
