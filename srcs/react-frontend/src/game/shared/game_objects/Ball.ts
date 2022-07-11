import Vector2 from "../util/Vector2";
import addKeyListeners from "../util/Interaction";
import { ICollider, Ray } from "../util/Collider";
import { GraphicalApplication, pixiGraphics } from "../../shared-header";

enum States {
  MOVING,
  BOUNCE_STALL,
}

class Ball {
  pos: Vector2;
  static readonly States = States;
  velocity: Vector2;

  state: States = States.MOVING;
  enteringState: boolean = false;
  elapsedTime: number = 0;

  colliders: Array<ICollider>;

  static readonly radius = 15;
  static readonly bounceStallDelay = 0.05;

  constructor() {
    this.velocity = new Vector2(10, -20);
    this.pos = new Vector2(0, 0);
    this.colliders = new Array<ICollider>();
  }

  public update(delta: number) {

    switch (this.state) {
      case States.BOUNCE_STALL:
        if (this.enteringState) {
          this.enteringState = false;
          this.elapsedTime = 0;
        }
        const t = this.elapsedTime / Ball.bounceStallDelay;
        // this._gfx.x = this.pos.x;
        // this._gfx.y = this.pos.y;
        // this._gfx?.scale.set(1, 0.5);
        this.elapsedTime += delta / 60;
        if (this.elapsedTime > Ball.bounceStallDelay) {
          this.state = States.MOVING;
          this.enteringState = true;
        }
        break;

      case States.MOVING:
        this.enteringState = false;
        // this._gfx?.scale.set(1, 1);
        // this._gfx.x = 0;
        // this._gfx.y = 0;

        const newPos = this.pos.add(this.velocity.scale(delta / 60));

        // gravity:
        this.velocity = this.velocity.subtract(
          new Vector2(0, (-1500 * delta) / 60)
        );

        const collisionPoint = this.findPossibleCollision(
          this.pos,
          newPos,
          this.colliders
        );

        //Avoid going over the wall by going exactly to the point where it would collide
        if (collisionPoint != null) {
          this.pos = collisionPoint;
        } else {
          this.pos = newPos;
        }
        break;
      default:
        break;
    }
  }

  private findPossibleCollision(
    oldPos: Vector2,
    newPos: Vector2,
    colliderList: Array<ICollider>
  ) {
    let chosenCollider = null;
    let minDist = 0;

    for (const collider of colliderList) {
      const diffRad = collider.normal(this.velocity).scale(-Ball.radius);
      if (
        collider.wouldPointCollide(oldPos.add(diffRad), newPos.add(diffRad))
      ) {
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
      chosenCollider.collider.onCollision(this);
      this.state = States.BOUNCE_STALL;
      this.enteringState = true;
      return chosenCollider.inter;
    }
    return null;
  }
}

export default Ball;
