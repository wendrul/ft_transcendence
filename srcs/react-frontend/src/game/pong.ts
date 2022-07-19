import * as PIXI from "pixi.js";
import Ball from "./shared/game_objects/Ball";
import Paddle from "./shared/game_objects/Paddle";
import Wall from "./shared/game_objects/Wall";
import { io } from "socket.io-client";

import addKeyListeners from "./shared/util/Interaction";

import { GraphicalApplication } from "./shared-header"
import BallDrawable from "./graphics/BallDrawable";
import PaddleDrawable from "./graphics/PaddleDrawable";
import WallDrawable from "./graphics/WallDrawable";
import Game from "./shared/util/Game";
import { GameStateMachine } from "./shared/util/state/GameStateMachine";

let app: GraphicalApplication;

declare global {
  var debugMode: boolean;
}

let game_starting_for_good = false;

export function gameSetup(instantiatedApp: GraphicalApplication) {
  if (!game_starting_for_good) {
    //Hacky way to avoid running this twice, should be fixed in the future
    game_starting_for_good = true;
    return;
  }
  // fetch("http://localhost:3000").then((s) => console.log(s));
  const socket = io("http://localhost:3000");
  socket.on("gameUpdate", (gameState: any) => {
    // p.phi = gameState.p1.phi;
    // p2.phi = gameState.p2.phi;
    // ball.pos.x = gameState.ballpos.x;
    // ball.pos.y = gameState.ballpos.y;
    // ball.velocity.x = gameState.ballvel.x;
    // ball.velocity.y = gameState.ballvel.y;
  });

  app = instantiatedApp;

  const game = new Game();

  const p = new PaddleDrawable(game.paddle1, app);
  const p2 = new PaddleDrawable(game.paddle2, app);

  addKeyListeners("w").press = () => (p.phi += 0.05);
  addKeyListeners("s").press = () => (p.phi -= 0.05);
  addKeyListeners("o").press = () => (p2.phi += 0.05);
  addKeyListeners("l").press = () => (p2.phi -= 0.05);

  const i_listener = addKeyListeners("i");
  i_listener.press = () => {
    globalThis.debugMode = !globalThis.debugMode;
  };
  globalThis.debugMode = false;

  const ball = new BallDrawable(game.ball, app);
  game.walls.forEach((w) => new WallDrawable(w, app))

  const gameStateMachine = new GameStateMachine(game);

  console.log("Finished Game setup");

  gameLoop(game);

  game_starting_for_good = true;
  let elapsed = 0;
  PIXI.Ticker.shared.add((delta) => {
    elapsed += delta / 60;
    if (elapsed > 0.03) {
      // console.log(elapsed);

      elapsed = 0;
      socket.emit("gameUpdate", {
        p1: { phi: p.phi },
        p2: { phi: p2.phi },
        ballpos: { x: ball.pos.x, y: ball.pos.y },
        ballvel: { x: ball.velocity.x, y: ball.velocity.y },
      });
    }
  });
}

function gameLoop(game: Game) {
  game.update();
  requestAnimationFrame(() => gameLoop(game));
}