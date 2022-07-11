import Vector2 from "../util/Vector2";
import { pixiGraphics } from "../../shared-header";
import { GraphicalApplication } from "../../shared-header";

export default class Player {
  name: String;

  rot: number;

  playerNo: 1 | 2;

  phi: number = 0;


  static readonly racketSize = 100;
  static readonly racketWidth = 10;
  static readonly fieldSize = 700;
  static readonly racketRadius = 600;

  constructor(name: String, playerNo: 1 | 2) {
    this.rot = 0;
    this.name = name;
    this.playerNo = playerNo;

    console.log(`Created player ${this.playerNo}`);
  }
  // public contains(x: number, y: number) {
  //   return this!._player_gfx.containsPoint(new Point(x, y));
  // }
}