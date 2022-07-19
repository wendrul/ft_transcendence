import Vector2 from "../util/Vector2";
import { pixiGraphics } from "../../shared-header";
import { GraphicalApplication } from "../../shared-header";
import { ICollider, Ray } from "../util/Collider";

export default class Paddle implements ICollider {
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

  wouldPointCollide(oldPos: Vector2, newPos: Vector2): boolean {
    throw new Error("Method not implemented.");
  }
  intersectRay(ray: Ray): Vector2 | null {
    throw new Error("Method not implemented.");
  }
  onCollision(collidingObject: any) {
    throw new Error("Method not implemented.");
  }
  normal(incoming: Vector2): Vector2 {
    throw new Error("Method not implemented.");
  }
}