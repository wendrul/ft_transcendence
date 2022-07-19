import * as PIXI from "pixi.js";
import "@pixi/graphics-extras";

import Paddle from "../shared/game_objects/Paddle";
import Drawable from "./Drawable";

export default class PaddleDrawable extends Drawable {
  private player: Paddle;
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
    this.player = new Paddle(name, playerNo);

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
    const theta = Math.atan(Paddle.racketSize / (2 * Paddle.racketRadius));
    let cx = fieldx - Paddle.racketRadius + Paddle.fieldSize / 2;
    const cy = fieldy;
    if (this.playerNo === 1) {
      phi += Math.PI;
      cx = fieldx + Paddle.racketRadius - Paddle.fieldSize / 2;
    }

    this.gfx!
      .beginFill(this.color)
      .drawTorus?.(
        cx,
        cy,
        Paddle.racketRadius - Paddle.racketWidth / 2,
        Paddle.racketRadius + Paddle.racketWidth / 2,
        phi - theta,
        phi + theta
      )
      .endFill();

    if (globalThis.debugMode) {
      this.gfx!.lineStyle(2, 0xffffff, 0.1); //Player.racketWidth, this.color);
      this.gfx!.arc(cx, cy, Paddle.racketRadius, phi + 20, phi - 20);
    }
  }
}