import * as PIXI from "pixi.js";
import "@pixi/graphics-extras";

import Player from "../shared/game_objects/Player";
import Drawable from "./Drawable";

export default class PlayerDrawable extends Drawable {
  private player: Player;
  private color: number = 0x9900ff;

  public get phi(): number {
    return this.player.phi;
  }
  
  public set phi(v : number) {
    this.player.phi = v;
  }
  
  public get playerNo(): number {
    return this.player.playerNo;
  }


  constructor(app: PIXI.Application, name: String, playerNo: 1 | 2) {
    super(app, true);
    this.player = new Player(name, playerNo);

    // app.ticker.add((delta) => {
    //     this.player.update(delta);
    // });
  }

  redraw() {
    this.gfx!.clear();

    this.drawRacket(
      this.phi,
      this.app!.renderer.width / 2,
      this.app!.renderer.height / 2
    );
  }

  private drawRacket(phi: number, fieldx: number, fieldy: number) {
    const theta = Math.atan(Player.racketSize / (2 * Player.racketRadius));
    let cx = fieldx - Player.racketRadius + Player.fieldSize / 2;
    const cy = fieldy;
    if (this.playerNo === 1) {
      phi += Math.PI;
      cx = fieldx + Player.racketRadius - Player.fieldSize / 2;
    }

    this.gfx!
      .beginFill(this.color)
      .drawTorus?.(
        cx,
        cy,
        Player.racketRadius - Player.racketWidth / 2,
        Player.racketRadius + Player.racketWidth / 2,
        phi - theta,
        phi + theta
      )
      .endFill();

    if (globalThis.debugMode) {
      this.gfx!.lineStyle(2, 0xffffff, 0.1); //Player.racketWidth, this.color);
      this.gfx!.arc(cx, cy, Player.racketRadius, phi + 20, phi - 20);
    }
  }
}