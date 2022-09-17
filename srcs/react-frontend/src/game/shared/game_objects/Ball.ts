import Vector2 from "../util/Vector2";
import { ICollider, Ray } from "../util/Collider";
import { cp } from "fs";
import IGameObject from "./IGameObject";
import Game from "../util/Game";
import EventHandler from "../util/EventHandler";
import { Utils } from "../util/Utils";
import { BlackHoleEffect } from "./powerups/Effects";

enum BallStates {
  MOVING,
  BOUNCE_STALL,
}

class Ball implements IGameObject {
  pos!: Vector2;
  velocity!: Vector2;

  state: BallStates = BallStates.MOVING;
  enteringState: boolean = false;
  elapsedTime: number = 0;

  colliders: Array<ICollider>;

  eventHandler: EventHandler;

  static readonly radius = 15;
  static readonly bounceStallDelay = 0.02;
  static readonly maxVelocity: number = 2500;
  static radius2: number = 15;
  rotSpeed: number = 0;
  static readonly MagnusForce: number = 0.000035;

  blackHoleGravitySource?: Vector2 | null;

  constructor(eventHandler: EventHandler) {
    this.eventHandler = eventHandler;
    this.reset();
    this.colliders = new Array<ICollider>();
    this.blackHoleGravitySource = null;
  }

  public update(dt: number) {
    if (this.velocity.norm() > Ball.maxVelocity) {
      this.velocity = this.velocity.normalized().scale(Ball.maxVelocity)
    }
    switch (this.state) {
      case BallStates.BOUNCE_STALL:
        if (this.enteringState) {
          this.enteringState = false;
          this.elapsedTime = 0;
        }
        const t = this.elapsedTime / Ball.bounceStallDelay;
        this.elapsedTime += dt / 60;
        if (this.elapsedTime > Ball.bounceStallDelay) {
          this.state = BallStates.MOVING;
          this.enteringState = true;
        }
        break;

      case BallStates.MOVING:
        this.enteringState = false;

        if (!(this.rotSpeed === 0 || this.velocity.norm() === 0)) {
          const F = Ball.MagnusForce * this.rotSpeed * this.velocity.norm();
          const magnusForce = this.velocity.rotate(Math.PI / 2).normalized().scale(F * dt);
          this.velocity = this.velocity.add(magnusForce);
        }

        if (this.blackHoleGravitySource !== null) {
          const grav = this.blackHoleGravitySource?.subtract(this.pos).normalized().scale(BlackHoleEffect.gravStrength * dt);
          this.velocity = this.velocity.add(grav!);
        }
        
        const newPos = this.pos.add(this.velocity.scale(dt / 60));
        const collidedObject = this.findPossibleCollision(
          this.pos,
          newPos,
          this.colliders
        );
        //Avoid going over the wall by going exactly to the point where it would collide
        if (collidedObject != null) {
          const collisionPoint = collidedObject.inter;
          this.pos = collisionPoint;
          // ball will be 1 pixel away from wall
          const normal = collidedObject.collider.onCollision(this);
          this.pos = this.pos.add(normal);
        } else {
          this.pos = newPos;
        }
        break;
      default:
        break;
    }
  }

  private gravity(delta: number) {
    this.velocity = this.velocity.subtract(
      new Vector2(0, (-1500 * delta) / 60)
    );
  }

  private findPossibleCollision(
    oldPos: Vector2,
    newPos: Vector2,
    colliderList: Array<ICollider>
  ) {
    let chosenCollider = null;
    let minDist = 0;

    for (const collider of colliderList) {
      const diffRad = collider.normal(this.velocity, this.pos).scale(-Ball.radius);
      if (collider.wouldPointCollide(oldPos.add(diffRad), newPos.add(diffRad))) {
        const inter = collider
          .intersectRay(new Ray(oldPos.add(diffRad), this.velocity.clone()))
          ?.subtract(diffRad);
        if (inter != null) {
          if (chosenCollider == null || minDist > inter.dist(oldPos)) {
            minDist = inter.dist(oldPos);
            chosenCollider = { collider: collider, inter: inter };
          }
        }
      }
    }

    if (chosenCollider != null) {
      this.state = BallStates.BOUNCE_STALL;
      this.enteringState = true;
      return chosenCollider;
    }
    return null;
  }

  public reset() {
    this.pos = new Vector2(Game.width / 2, Game.height / 2);
    this.velocity = new Vector2(0,0);
    this.rotSpeed = 0;
  }
}

export default Ball;
