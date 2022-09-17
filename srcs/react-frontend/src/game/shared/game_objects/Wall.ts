// import * as PIXI from "pixi.js";
// import { Graphics } from "pixi.js";
import {
  ICollider,
  Ray,
  rayIntersection as lineIntersecton,
} from "../util/Collider";
import { Utils } from "../util/Utils";
import Vector2 from "../util/Vector2";
import Ball from "./Ball";
import IGameObject from "./IGameObject";

class Wall implements IGameObject, ICollider {
  pos: Vector2;
  height: number;
  width: number;

  colliderRay: Ray;

  colliderSide: "top" | "bot" | "left" | "right";
  lastWouldCollide: boolean;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    side: "top" | "bot" | "left" | "right" = "bot"
  ) {
    this.pos = new Vector2(x, y);
    this.height = height;
    this.width = width;
    this.colliderSide = side;
    this.lastWouldCollide = false;

    switch (side) {
      case "top":
        this.colliderRay = new Ray(new Vector2(x, y), new Vector2(width, 0));
        break;
      case "bot":
        this.colliderRay = new Ray(
          new Vector2(x, y + height),
          new Vector2(width, 0)
        );
        break;
      case "left":
        this.colliderRay = new Ray(new Vector2(x, y), new Vector2(0, height));
        break;
      case "right":
        this.colliderRay = new Ray(
          new Vector2(x + width, y),
          new Vector2(0, height)
        );
        break;
      default:
        this.colliderRay = new Ray(this.pos.clone(), new Vector2(x + width, y));
        break;
    }
  }

  public update(delta: number) {}

  public intersectRay(ray: Ray): Vector2 | null {
    const inter = lineIntersecton(this.colliderRay, ray);

    if (!inter) return null;

    const distanceFromStart = inter.subtract(this.colliderRay.pos).norm();
    if (
      distanceFromStart >= 0 &&
      distanceFromStart < this.colliderRay.dir.norm()
    )
      return inter;
    return null;
  }

  public normal(incoming: Vector2): Vector2 {
    let normal = this.colliderRay.dir.rotate(Math.PI / 2).normalized();
    if (normal.dot(incoming) > 0) {
      normal = normal.rotate(Math.PI);
    }
    return normal;
  }

  public onCollision(ball: Ball): Vector2 {
    const normal = this.normal(ball.velocity);
    const v = ball.velocity;
    const angle = Math.atan2(normal.cross(v), v.dot(normal)) * 2;

    ball.velocity = ball.velocity.rotate(
      -angle + Math.PI
    );

    //Decrease velocity by 20% on bounce
    ball.velocity = ball.velocity.scale(1.01);
    return normal;
  }

  public wouldPointCollide(oldPos: Vector2, newPos: Vector2): boolean {
    const crossOld = this.colliderRay.pos
      .subtract(oldPos)
      .cross(this.colliderRay.dir);
    const crossNew = this.colliderRay.pos
      .subtract(newPos)
      .cross(this.colliderRay.dir);

    if ((crossNew >= 0 && crossOld >= 0) || (crossNew <= 0 && crossOld <= 0))
      this.lastWouldCollide = false;
    else this.lastWouldCollide = true;
    return this.lastWouldCollide;
  }
}

export default Wall;
