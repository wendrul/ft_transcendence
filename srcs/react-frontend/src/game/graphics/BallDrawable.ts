import * as PIXI from "pixi.js";
import "@pixi/graphics-extras";

import Ball from "../shared/game_objects/Ball";
import IDrawable from "./IDrawable";
import Drawable from "./Drawable";
import Vector2 from "../shared/util/Vector2";
import addKeyListeners from "../shared/util/Interaction";
import { ICollider } from "../shared/util/Collider";

export default class BallDrawable extends Drawable {
    private ball: Ball;

    constructor(app: PIXI.Application) {
        super(app, true);
        this.ball = new Ball();
        this.pos = new Vector2(app.renderer.width / 2, app.renderer.height / 2);

        app.ticker.add((delta) => {
            this.ball.update(delta);
        });

        this.addKListener(); //garbage
    }

    public get pos() : Vector2 {
        return this.ball.pos;
    }
    public set pos(v : Vector2) {
        this.ball.pos = v;
    }
    // static readonly States = States;
    public get velocity() : Vector2 {
        return this.ball.velocity;
    }

    public get colliders() : Array<ICollider> {
        return this.ball.colliders;
    }

    redraw() {
        this.gfx!.clear();

        this.gfx!.moveTo(this.pos.x, this.pos.y)
          .beginFill(0xfffffff)
          .drawCircle(Ball.radius, Ball.radius, Ball.radius)
          .endFill();
        this.gfx!.x = this.pos.x;
        this.gfx!.y = this.pos.y;
        this.gfx!.pivot.x = Ball.radius;
        this.gfx!.pivot.y = Ball.radius;

        if (globalThis.debugMode) {
          const col_start = this.pos;
          const col_end = this.velocity
            .scale(0.1)
            .add(new Vector2(Ball.radius, Ball.radius));
          this.gfx!.moveTo(Ball.radius, Ball.radius)
            .lineStyle(3, 0xfcdb03)
            .lineTo(col_end.x, col_end.y)
            .endFill();
        }
      }

    addKListener(): void { //garbage
        const k_Listener = addKeyListeners("k");
        k_Listener.press = () => {
            // this.velocity = this.velocity.normalized().scale(1000);
            this.velocity.setFromPolarCoords(
                Math.random() * 1000 + 2000,
                Math.random() * Math.PI * 2
              );
              console.log(this.pos);
              console.log(this.velocity);
        };
    }
}