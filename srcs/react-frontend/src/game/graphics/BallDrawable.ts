import * as PIXI from "pixi.js";
import "@pixi/graphics-extras";
import * as particles from "@pixi/particle-emitter";

import Ball from "../shared/game_objects/Ball";
import Drawable from "./Drawable";
import Vector2 from "../shared/util/Vector2";
import addKeyListeners from "../shared/util/Interaction";
import Whaff from "../Whaff";
import { GameColors } from "../gameColors";

export default class BallDrawable extends Drawable {
  private ball: Ball;
  private emitter: particles.Emitter;
  private particleContainer: PIXI.ParticleContainer;

  constructor(
    ball: Ball,
    app: PIXI.Application,
    public colorStart = GameColors.particle_start,
    public colorEnd = GameColors.particle_end,
    // public colorStart = "#e3f9ff",
    // public colorEnd = "#e3f9ff"
  ) {
    super(app, true);
    this.ball = ball;
    this.particleContainer = new PIXI.ParticleContainer();

    const texture = this.createTexture(0, 8, app.renderer.resolution);
    const pointer = new PIXI.Point(app.screen.width / 2, app.screen.height / 2);
    const artConfig = {
      autoUpdate: true,
      alpha: {
        start: 0.8,
        end: 0.15,
      },
      scale: {
        start: 1.7,
        end: 0.4,
        minimumScaleMultiplier: 1,
      },
      color: {
        start: this.colorStart,
        end: this.colorEnd,
      },
      speed: {
        start: 0,
        end: 0,
        minimumSpeedMultiplier: 1,
      },
      acceleration: {
        x: 0,
        y: 0,
      },
      maxSpeed: 0,
      startRotation: {
        min: 0,
        max: 0,
      },
      noRotation: true,
      rotationSpeed: {
        min: 0,
        max: 0,
      },
      lifetime: {
        min: 0.3,
        max: 0.8,
      },
      blendMode: "normal",
      frequency: 0.0008,
      emitterLifetime: -1,
      maxParticles: 5000,
      pos: {
        x: 0,
        y: 0,
      },
      addAtBack: false,
      spawnType: "point",
    };

    this.emitter = new particles.Emitter(
      this.particleContainer,
      particles.upgradeConfig(artConfig, [texture])
    );

    this.emitter.emit = true;
    this.emitter.autoUpdate = true;

    app.stage.removeChild(this.gfx);
    app.stage.addChild(this.particleContainer);
    app.stage.addChild(this.gfx);
    this.emitter.updateOwnerPos(this.pos.x, this.pos.y);
  }

  private get pos(): Vector2 {
    return this.ball.pos;
  }

  private get velocity(): Vector2 {
    return this.ball.velocity;
  }

  redraw() {
    this.gfx!.clear();

    this.gfx!.moveTo(this.pos.x, this.pos.y)
      .beginFill(GameColors.ball)
      // .beginFill(0xffffff)
      .drawCircle(Ball.radius, Ball.radius, Ball.radius)
      .endFill();
    this.gfx!.x = this.pos.x;
    this.gfx!.y = this.pos.y;
    this.gfx!.pivot.x = Ball.radius;
    this.gfx!.pivot.y = Ball.radius;

    this.emitter.updateOwnerPos(this.pos.x, this.pos.y);
    if (Whaff.debugMode) {
      const col_start = this.pos;
      const col_end = this.velocity
        .scale(0.1)
        .add(new Vector2(Ball.radius, Ball.radius));
      this.gfx!.moveTo(Ball.radius, Ball.radius)
        .lineStyle(3, GameColors.debug)
        .lineTo(col_end.x, col_end.y)
        .endFill();
    }
  }

  private createTexture(r1: number, r2: number, resolution: any) {
    const c = (r2 + 1) * resolution;
    r1 *= resolution;
    r2 *= resolution;

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = canvas.height = c * 2;

    const gradient = context!.createRadialGradient(c, c, r1, c, c, r2);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");

    context!.fillStyle = gradient;
    context!.fillRect(0, 0, canvas.width, canvas.height);

    return PIXI.Texture.from(canvas);
  }
}
