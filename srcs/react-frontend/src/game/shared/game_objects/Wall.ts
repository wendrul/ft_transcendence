// import * as PIXI from "pixi.js";
// import { Graphics } from "pixi.js";
import { ICollider, Ray, rayIntersection as lineIntersecton } from "../util/Collider";
import Vector2 from "../util/Vector2";
import IGameObject from "./IGameObject";

class Wall implements IGameObject, ICollider {
  pos: Vector2;
  height: number;
  width: number;


  colliderRay: Ray;

  colliderSide: "top" | "bot" | "left" | "right";


  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    side: "top" | "bot" | "left" | "right" = "bot",
  ) {
    this.pos = new Vector2(x, y);
    this.height = height;
    this.width = width;
    this.colliderSide = side;

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

  public update(delta: number) {
  }

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

  public onCollision(collidingObject: any): Vector2 {
    const normal = this.normal(collidingObject.velocity);
    const v = collidingObject.velocity;
    const angle = Math.atan2(normal.cross(v), v.dot(normal)) * 2;
    
    collidingObject.velocity = collidingObject.velocity.rotate(
      -angle + Math.PI
    );

    //Decrease velocity by 20% on bounce
    collidingObject.velocity = collidingObject.velocity.scale(1);
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
      return false;
    return true;
  }
}

export default Wall;
