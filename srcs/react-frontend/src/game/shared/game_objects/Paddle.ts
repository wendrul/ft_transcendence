import Vector2 from "../util/Vector2";
import { ICollider, Ray } from "../util/Collider";
import Ball from "./Ball";
import IGameObject from "./IGameObject";
import Game, { GameEvents } from "../util/Game";
import { Utils } from "../util/Utils";
import EventHandler from "../util/EventHandler";

export default class Paddle implements ICollider, IGameObject {
  name: string;

  playerNo: 1 | 2;

  phi: number = 0;

  arcCenter: Vector2;

  pos: Vector2;

  private _target!: Vector2;
  public static maxAngle: number = (45 * Math.PI) / 360;
  velocity: any;
  static vel_to_F_factor: number = 2 / 100;
  static maxForce: number = 0.001;
  private velocities: number[];
  public get target(): Vector2 {
    return this._target;
  }
  public set target(v: Vector2) {
    this._target = v;
  }
  private last_positions: number[];

  private FTBO_K = 0.0001;

  static readonly racketSize = 150;
  static readonly racketWidth = 15;
  static readonly fieldSize =  1000;
  static readonly racketRadius = 600;

  constructor(
    name: string,
    playerNo: 1 | 2,
    fieldCenterX: number,
    fieldCenterY: number,
    private eventHandler: EventHandler
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
    this.target = this.pos.clone();
    this.last_positions = new Array<number>(2).fill(0);
    this.velocities = new Array<number>(3).fill(0);
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
    this.last_positions.push(this.phi);
    this.last_positions.shift();
    this.velocities.push(
      (this.last_positions[1] - this.last_positions[0]) / dt
    );
    this.velocities.shift();
    this.velocity = Utils.mean(this.velocities);
  }

  private updatePos(dt: number) {
    const diff = this.pos.y - Utils.clamp(this.target.y, 0, Game.height);
    if (Math.abs(diff) > 0.000001) {
      this.phi -= this.FTBO_K * diff * dt;
    }
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

  onCollision(ball: Ball) {
    const normal = this.normal(ball.velocity, ball.pos);
    const v = ball.velocity;
    const angle = Math.atan2(normal.cross(v), v.dot(normal)) * 2;

    ball.velocity = ball.velocity.rotate(
      -angle + Math.PI
    );

    ball.rotSpeed += this.velocity * Paddle.racketRadius * Ball.radius2;
 

    //Increase ball velocity by 5% when colliding with paddle
    ball.velocity = ball.velocity.scale(1.05);

    this.eventHandler.call_callbacks(GameEvents.PaddleBallCollide);
    return normal;
  }

  normal(incomingDir: Vector2, incomingPos: Vector2): Vector2 {
    const posMoreBehind = incomingPos.subtract(incomingDir.normalized().scale(30));
    const inter = this.intersectCircle(new Ray(posMoreBehind, incomingDir));
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
