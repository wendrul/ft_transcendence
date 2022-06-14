import * as PIXI from "pixi.js";
import { Point } from "pixi.js";
import Vector2 from "../util/Vector2";
import { Graphics } from "@pixi/graphics";
import "@pixi/graphics-extras";

class Player {
  name: String;

  pos: Vector2;

  rot: number;

  color: number;

  playerNo: 1 | 2;

  private _player_gfx: PIXI.Graphics;
  private _elapsed: number;
  private _app: PIXI.Application;

  static readonly racketSize = 100;
  static readonly racketWidth = 10;
  static readonly fieldSize = 700;
  static readonly racketRadius = 600;

  constructor(app: PIXI.Application, name: String, playerNo: 1 | 2) {
    this.pos = new Vector2(200, 200);
    this.rot = 0;
    this.name = name;
    this._player_gfx = new Graphics();
    this._elapsed = 0;
    this.color = 0xff0099;
    this.playerNo = playerNo;

    app.ticker.add((delta) => {
      this.update(delta);
    });
    this._app = app;
    this._app.stage.addChild(this._player_gfx);
    console.log(`Created player ${this.playerNo}`);
  }

  private update(delta: number) {
    this._elapsed += delta;
    const x = this.pos.x;
    const y = this.pos.y;

    this._player_gfx.clear();

    const phi = 0.3 * Math.cos(0.05 * this.playerNo * this._elapsed);
    this.drawRacket(
      phi,
      this._app.renderer.width / 2,
      this._app.renderer.height / 2
    );

    if (this._player_gfx.containsPoint(new Point(100, 300))) {
      this.color = 0xff0000;
      console.log("hit");
    } else {
      this.color = 0xff00ff;
    }
  }

  private drawRacket(phi: number, fieldx: number, fieldy: number) {
    const theta = Math.atan(Player.racketSize / (2 * Player.racketRadius));
    let cx = fieldx - Player.racketRadius + Player.fieldSize / 2;
    const cy = fieldy;
    if (this.playerNo === 1) {
      phi += Math.PI;
      cx = fieldx + Player.racketRadius - Player.fieldSize / 2;
    }

    this._player_gfx
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
      this._player_gfx.lineStyle(2, 0xffffff, 0.1); //Player.racketWidth, this.color);
      this._player_gfx.arc(cx, cy, Player.racketRadius, phi + 20, phi - 20);
    }
  }

  public contains(x: number, y: number) {
    return this._player_gfx.containsPoint(new Point(x, y));
  }
}

export default Player;
