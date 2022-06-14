import * as PIXI from "pixi.js";
import Ball from "./game_objects/Ball";
import Player from "./game_objects/Player";
import Wall from "./game_objects/Wall";

import sample from "./sample.png";
import addKeyListeners from "./util/Interaction";

let app: PIXI.Application;

declare global {
  var debugMode: boolean;
}

let game_starting_for_good = false;

function redrawStatics(statics : any) {
  for (const staticGraphic of statics) {
    staticGraphic.redraw();
  }
}

export function gameSetup(instantiatedApp: PIXI.Application) {
  if (!game_starting_for_good) {
    //Hacky way to avoid running this twice, should be fixed in the future
    game_starting_for_good = true;
    return;
  }

  app = instantiatedApp;

  const p = new Player(app, "John", 1);
  // const p2 = new Player(app, "John2", 2);

  const i_listener = addKeyListeners("i")
  i_listener.press = () => {
    globalThis.debugMode = !globalThis.debugMode;
    redrawStatics([...walls]);
  }
  globalThis.debugMode = false;
  
  let walls : any = [];
  walls.push(new Wall(app, 100,0,700,100, "bot"));
  walls.push(new Wall(app, 100,500,700,100, "top"));
  walls.push(new Wall(app, 100,0,50,600, "right"));
  walls.push(new Wall(app, 750,0,50,600, "left"));
  redrawStatics([...walls]);
  
  const ball = new Ball(app);
  ball.colliders.push(...walls);

  console.log("Finished Game setup");
  game_starting_for_good = true;
  main();
}

function main() {
  
}
