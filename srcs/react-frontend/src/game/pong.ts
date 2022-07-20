import * as PIXI from "pixi.js";
import Ball from "./shared/game_objects/Ball";
import Paddle from "./shared/game_objects/Paddle";
import Wall from "./shared/game_objects/Wall";
import { io } from "socket.io-client";

import addKeyListeners from "./shared/util/Interaction";

import {GraphicalApplication} from "./shared-header"
import BallDrawable from "./graphics/BallDrawable";
import PaddleDrawable from "./graphics/PaddleDrawable";
import WallDrawable from "./graphics/WallDrawable";
import Vector2 from "./shared/util/Vector2";
import { Ray } from "./shared/util/Collider";
import { GraphicalDebugger } from "./graphics/Debug";

let app: GraphicalApplication;

declare global {
  var debugMode: boolean;
  var debugTool: GraphicalDebugger;
}

let game_starting_for_good = false;

function redrawStatics(statics: any) {
  for (const staticGraphic of statics) {
    staticGraphic.redraw();
  }
}

export function gameSetup(instantiatedApp: GraphicalApplication) {
  if (!game_starting_for_good) {
    //Hacky way to avoid running this twice, should be fixed in the future
    game_starting_for_good = true;
    return;
  }
  // fetch("http://localhost:3000").then((s) => console.log(s));
  const socket = io("http://localhost:3000");
  socket.on("gameUpdate", (gameState : any) => {
    // p.phi = gameState.p1.phi;
    // p2.phi = gameState.p2.phi;
    // ball.pos.x = gameState.ballpos.x;
    // ball.pos.y = gameState.ballpos.y;
    // ball.velocity.x = gameState.ballvel.x;
    // ball.velocity.y = gameState.ballvel.y;
  });

  app = instantiatedApp;

  const p1back = new Paddle("Jhon", 1, app.renderer.height / 2, app.renderer.width/2);
  const p2back = new Paddle("Jhon2", 2, app.renderer.height / 2, app.renderer.width/2);

  const p = new PaddleDrawable(app, "John", 1);
  const p2 = new PaddleDrawable(app, "John2", 2);

  addKeyListeners("w").press = () => (p.phi += 0.05);
  addKeyListeners("s").press = () => (p.phi -= 0.05);
  addKeyListeners("o").press = () => (p2.phi += 0.05);
  addKeyListeners("l").press = () => (p2.phi -= 0.05);

  addKeyListeners("w").press = () => (p1back.phi += 0.05);
  addKeyListeners("s").press = () => (p1back.phi -= 0.05);
  addKeyListeners("o").press = () => (p2back.phi += 0.05);
  addKeyListeners("l").press = () => (p2back.phi -= 0.05);

  const i_listener = addKeyListeners("i");
  i_listener.press = () => {
    globalThis.debugMode = !globalThis.debugMode;
    redrawStatics([...walls]);
  };
  globalThis.debugMode = false;


  let walls: any = [];
  walls.push(new WallDrawable(app, 50, 0, 900, 100, "bot"));
  walls.push(new WallDrawable(app, 50, 500, 900, 100, "top"));
  walls.push(new WallDrawable(app, 50, 0, 50, 600, "right"));
  walls.push(new WallDrawable(app, 900, 0, 50, 600, "left"));
  redrawStatics([...walls]);

  const ball = new BallDrawable(app);
  ball.colliders.push(...walls, p1back, p2back);
  globalThis.debugTool = new GraphicalDebugger(app);


  console.log("Finished Game setup");
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
  main();
}



function main() {}
