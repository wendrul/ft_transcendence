import Vector2 from "../shared/util/Vector2";
import * as PIXI from "pixi.js";
import { Ray } from "../shared/util/Collider";

export class GraphicalDebugger {
  app: PIXI.Application;
  gfx: PIXI.Graphics;
  constructor(app: PIXI.Application) {
    this.app = app;
    this.gfx = new PIXI.Graphics();
    this.app.stage.addChild(this.gfx);
  }

  clear() {
    this.gfx.clear();
  }

  drawDot(pos: Vector2) {
    const radius = 5;
    this.gfx!.moveTo(pos.x, pos.y)
      .beginFill(0xff0000)
      .drawCircle(pos.x, pos.y, radius)
      .endFill();
    // this.gfx!.x = pos.x;
    // this.gfx!.y = pos.y;
  }

  drawRay(ray: Ray, scale: number = 1) {
    const col_end = ray.pos.add(ray.dir.scale(scale));
    // this.gfx!.x = ray.pos.x;
    // this.gfx!.y = ray.pos.y;
    this.gfx!.moveTo(ray.pos.x, ray.pos.y)
      .lineStyle(3, 0x00db03)
      .lineTo(col_end.x, col_end.y)
      .endFill();
  }
}
