import Vector2 from "../util/Vector2";
import { ICollider, Ray } from "../util/Collider";
import Ball from "./Ball";
import IGameObject from "./IGameObject";
import Game from "../util/Game";
import { Utils } from "../util/Utils";

export default class Paddle implements ICollider, IGameObject {
  name: string;

  playerNo: 1 | 2;

  phi: number = 0;

  arcCenter: Vector2;

  pos: Vector2;

  private _target!: Vector2;
  public static maxAngle: number = (40 * Math.PI) / 360;
  public get target(): Vector2 {
    return this._target;
  }
  public set target(v: Vector2) {
    this._target = v;
  }

  private FTBO_K = 0.00005;

  static readonly racketSize = 100;
  static readonly racketWidth = 10;
  static readonly fieldSize = 700;
  static readonly racketRadius = 600;

  constructor(
    name: string,
    playerNo: 1 | 2,
    fieldCenterX: number,
    fieldCenterY: number
  ) {
    this.name = name;
    this.playerNo = playerNo;
    let cx = fieldCenterX - Paddle.racketRadius + Paddle.fieldSize / 2;
    if (playerNo === 1) {
      this.FTBO_K *= -1;
      cx = fieldCenterX + Paddle.racketRadius - Paddle.fieldSize / 2;
    }
    const cy = fieldCenterY;
    this.arcCenter = new Vector2(cx, cy);
    const phi = this.playerNo === 2 ? this.phi : this.phi + Math.PI;
    this.pos = this.arcCenter.add(
      new Vector2(
        Math.cos(phi) * Paddle.racketRadius,
        Math.sin(phi) * Paddle.racketRadius
      )
    );
    this.target = this.pos;
  }

  update(dt: number) {
    const phi = this.playerNo === 2 ? this.phi : this.phi + Math.PI;
    this.pos = this.arcCenter.add(
      new Vector2(
        Math.cos(phi) * Paddle.racketRadius,
        Math.sin(phi) * Paddle.racketRadius
      )
    );
    this.updatePos(dt);
  }

  private updatePos(dt: number) {
    const diff = this.pos.y - this.target.y;
    this.phi -= this.FTBO_K * diff * dt;
    this.phi = Utils.clamp(this.phi, -Paddle.maxAngle, +Paddle.maxAngle);
  }

  wouldPointCollide(oldPos: Vector2, newPos: Vector2): boolean {
    if (
      oldPos.dist(this.arcCenter) <= Paddle.racketRadius &&
      newPos.dist(this.arcCenter) > Paddle.racketRadius
    )
      return true;
    return false;
  }

  intersectCircle(ray: Ray): Vector2 | null {
    // https://www.bluebill.net/circle_ray_intersection.html
    const rdir = ray.dir.normalized();

    const u = this.arcCenter.subtract(ray.pos);
    const u1 = rdir.scale(u.dot(rdir));
    const u2 = u.subtract(u1);
    const d = u2.norm();

    if (d > Paddle.racketRadius) {
      return null;
    }
    const m = Math.sqrt(Paddle.racketRadius ** 2 - d ** 2);
    if (m > u1.norm()) {
      // ray.pos is inside the circle => only 1 intersection possible
      return ray.pos.add(u1).add(rdir.scale(m)); // ray.pos + u1 + m*rdir
    }
    return null; // ignore collisions coming from outside the circle aka backside of the paddle
    // return ray.pos.add(u1).add(rdir.scale(-m));
  }

  intersectRay(ray: Ray): Vector2 | null {
    const circleInter = this.intersectCircle(ray);

    if (circleInter == null) return null;

    const centerToPaddle = this.pos.subtract(this.arcCenter).normalized();
    const centerToInter = circleInter.subtract(this.arcCenter).normalized();

    const angleDiff = Math.acos(centerToInter.dot(centerToPaddle));
    const theta = Math.atan(
      (Paddle.racketSize + 2 * Ball.radius) / (2 * Paddle.racketRadius)
    );

    if (angleDiff > theta) return null;

    return circleInter;
  }

  onCollision(collidingObject: any) {
    const normal = this.normal(collidingObject.velocity, collidingObject.pos);
    const v = collidingObject.velocity;
    const angle = Math.atan2(normal.cross(v), v.dot(normal)) * 2;

    collidingObject.velocity = collidingObject.velocity.rotate(
      -angle + Math.PI
    );

    //Decrease velocity by 20% on bounce
    collidingObject.velocity = collidingObject.velocity.scale(1.05);
    return normal;
  }

  normal(incomingDir: Vector2, incomingPos: Vector2): Vector2 {
    const inter = this.intersectCircle(new Ray(incomingPos, incomingDir));
    if (inter == null) {
      return new Vector2(0, 1);
      // throw new Error(
      //   "Tried to get normal with paddle but there was no intersection"
      // );
    }
    let normal = inter.subtract(this.arcCenter).normalized();
    if (normal.dot(incomingDir) > 0) {
      normal = normal.rotate(Math.PI);
    }
    return normal;
  }

  reset() {
    this.phi = 0;
  }
}
