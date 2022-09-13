import Vector2 from "../util/Vector2";
import addKeyListeners from "../util/Interaction";
import { ICollider, Ray } from "../util/Collider";
import { cp } from "fs";
import IGameObject from "./IGameObject";
import Game from "../util/Game";
import EventHandler from "../util/EventHandler";
import { Utils } from "../util/Utils";

enum BallStates {
  MOVING,
  BOUNCE_STALL,
}

class Ball implements IGameObject {
  pos!: Vector2;
  velocity!: Vector2;
  omega!: number
  magnusForce: Vector2 = new Vector2(0, 0);

  state: BallStates = BallStates.MOVING;
  enteringState: boolean = false;
  elapsedTime: number = 0;

  colliders: Array<ICollider>;

  private eventHandler: EventHandler;

  static readonly radius = 15;
  static readonly bounceStallDelay = 0.02;

  constructor(eventHandler: EventHandler) {
    this.eventHandler = eventHandler;
    this.reset();
    this.colliders = new Array<ICollider>();
  }

  public update(delta: number) {
    switch (this.state) {
      case BallStates.BOUNCE_STALL:
        if (this.enteringState) {
          this.enteringState = false;
          this.elapsedTime = 0;
        }
        const t = this.elapsedTime / Ball.bounceStallDelay;
        this.elapsedTime += delta / 60;
        if (this.elapsedTime > Ball.bounceStallDelay) {
          this.state = BallStates.MOVING;
          this.enteringState = true;
        }
        break;

      case BallStates.MOVING:
        this.enteringState = false;
        const newPos = this.pos.add(this.velocity.scale(delta / 60));

        this.velocity = this.velocity.rotate(this.omega * this.velocity.x);
        this.omega += (delta / 1000) * Utils.clamp(this.magnusForce.y, -0.001, 0.001);

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
    this.omega = 0;
    this.pos = new Vector2(Game.width / 2, Game.height / 2);
    this.velocity = new Vector2(0,0);
    this.magnusForce = new Vector2(0,0);
  }
}

export default Ball;
