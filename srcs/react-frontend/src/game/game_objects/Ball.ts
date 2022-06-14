import Vector2 from "../util/Vector2";
import * as PIXI from "pixi.js";
import { Graphics } from "pixi.js";
import addKeyListeners from "../util/Interaction";
import { ICollider, Ray } from "../util/Collider";

class Ball {
  pos: Vector2;

  velocity: Vector2;

  private _gfx: Graphics;
  private _app: PIXI.Application;
  colliders: Array<ICollider>;

  static readonly radius = 15;

  constructor(app: PIXI.Application) {
    this.pos = new Vector2(app.renderer.width / 2, app.renderer.height / 2);
    this.velocity = new Vector2(10, -20);

    this._gfx = new Graphics();
    this._app = app;

    this.colliders = new Array<ICollider>();

    app.ticker.add((delta) => {
      this.update(delta);
    });
    this._app.stage.addChild(this._gfx);
    const k_Listener = addKeyListeners("k");
    k_Listener.press = () => {
      this.setRandomVelocity();
    };
  }

  redraw() {
    this._gfx.clear();

    this._gfx
      .beginFill(0xfffffff)
      .drawCircle(this.pos.x, this.pos.y, Ball.radius)
      .endFill();

    if (globalThis.debugMode) {
      const col_start = this.pos;
      const col_end = this.velocity.scale(0.3).add(col_start);
      this._gfx
        .moveTo(col_start.x, col_start.y)
        .lineStyle(3, 0xfcdb03)
        .lineTo(col_end.x, col_end.y)
        .endFill();
    }
  }

  private update(delta: number) {
    this.redraw();

    const newPos = this.pos.add(this.velocity.scale(delta / 60));
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
      return chosenCollider.inter;
    }
    return null;
  }

  public setRandomVelocity() {
    this.velocity.setFromPolarCoords(
      Math.random() * 1000 + 2000,
      Math.random() * Math.PI * 2
    );
  }
}

export default Ball;
