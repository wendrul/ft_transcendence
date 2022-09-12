import Vector2 from "./Vector2";

export function rayIntersection(a: Ray, b: Ray) {
  const as = a.pos;
  const ad = a.dir;
  const bs = b.pos;
  const bd = b.dir;

  const dx = bs.x - as.x;
  const dy = bs.y - as.y;
  const det = bd.x * ad.y - bd.y * ad.x;

  if (det === 0) return null;

  const u = (dy * bd.x - dx * bd.y) / det;
  const v = (dy * ad.x - dx * ad.y) / det;
  const inter = as.add(ad.scale(u));

  if (u >= 0 && v >= 0) return inter;
  return null;
}

export class Ray {
  pos: Vector2;
  dir: Vector2;
  constructor(pos: Vector2, dir: Vector2) {
    this.pos = pos;
    this.dir = dir;
  }
}

export interface ICollider {
  wouldPointCollide(oldPos: Vector2, newPos: Vector2): boolean;
  intersectRay(ray: Ray): Vector2 | null;
  onCollision(collidingObject: any): any;
  normal(incomingDir: Vector2, incomingPos?: Vector2): Vector2;
}
