import * as PIXI from "pixi.js";
import Ball from "./shared/game_objects/Ball";
import Paddle from "./shared/game_objects/Paddle";
import Wall from "./shared/game_objects/Wall";
import { io } from "socket.io-client";

import addKeyListeners from "./shared/util/Interaction";

import BallDrawable from "./graphics/BallDrawable";
import PaddleDrawable from "./graphics/PaddleDrawable";
import WallDrawable from "./graphics/WallDrawable";
import Vector2 from "./shared/util/Vector2";
import { Ray } from "./shared/util/Collider";
import { GraphicalDebugger } from "./graphics/Debug";
import Game from "./shared/util/Game";
import { GameStateMachine } from "./shared/util/state/GameStateMachine";

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
  const socket = io("http://localhost:3000");
  socket.on("gameUpdate", (gameState: any) => {
    game.paddle1.phi = gameState.p1.phi;
    game.paddle2.phi = gameState.p2.phi;
    game.ball.pos.x = gameState.ballpos.x;
    game.ball.pos.y = gameState.ballpos.y;
    game.ball.velocity.x = gameState.ballvel.x;
    game.ball.velocity.y = gameState.ballvel.y;
  });

  app = instantiatedApp;

  const game = new Game();

  const p1 = new PaddleDrawable(game.paddle1, app);
  const p2 = new PaddleDrawable(game.paddle2, app);

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

  const ball = new BallDrawable(game.ball, app);
  game.walls.forEach((w) => new WallDrawable(w, app));

  const gameStateMachine = new GameStateMachine(game);

  console.log("Finished Game setup");

  gameLoop(game);

  game_starting_for_good = true;
  let t = performance.now();
  let elapsed = t;
  function coms() {
    const dt = performance.now() - t;
    t = performance.now();
    if (t - elapsed > 3000) {
      console.log(t - elapsed);
      
      elapsed = t;
      const send = {
        time: t,
        p1: { phi: game.paddle1.phi },
        p2: { phi: game.paddle2.phi },
        ballpos: { x: game.ball.pos.x, y: game.ball.pos.y },
        ballvel: { x: game.ball.velocity.x, y: game.ball.velocity.y },
      };
      socket.emit("gameUpdate", send);
    }
    setTimeout(() => coms(), 10);
  }
  requestAnimationFrame(() => coms());
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
}

function gameLoop(game: Game) {
  game.update();
  requestAnimationFrame(() => gameLoop(game));
}
