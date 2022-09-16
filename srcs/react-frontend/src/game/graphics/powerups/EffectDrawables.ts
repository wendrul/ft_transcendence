import * as PIXI from "pixi.js";
import "@pixi/graphics-extras";
import Drawable from "../Drawable";
import WallDrawable from "../WallDrawable";
import { BlackHoleEffect, CageEffect, DefensiveWallEffect } from "../../shared/game_objects/powerups/Effects";
import Effect, { EffectType } from "../../shared/game_objects/powerups/Effect";
import { EffectDrawable } from "./EffectDrawable";
import BallDrawable from "../BallDrawable";
import Ball from "../../shared/game_objects/Ball";
import Vector2 from "../../shared/util/Vector2";
import Whaff from "../../Whaff";

export function LoadEffectDrawablesModule() { }

@EffectDrawable.register
export class CageEffectDrawable extends EffectDrawable {
    effectType: EffectType;
    private color: number;
    private walls: WallDrawable[];
    cageEffect: CageEffect;

    constructor(cageEffect: CageEffect, app: PIXI.Application) {
        super(cageEffect, app);

        this.effectType = EffectType.Cage;
        this.color = 0xff0000;
        this.walls = [];
        this.cageEffect = cageEffect;
    }

    public redraw() {

    }

    public onStart(): void {
        this.cageEffect.walls.forEach((w) => this.walls.push(new WallDrawable(w, this.app, this.color)));
    }

    public onEnd(): void {
        this.walls.forEach((w) => {
            this.app.stage.removeChild(w.gfx);
        });
    }
}

@EffectDrawable.register
export class BlackHoleEffectDrawable extends EffectDrawable {
    effectType: EffectType;
    private color: number;
    blackHoleEffect: BlackHoleEffect;

    constructor(effect: BlackHoleEffect, app: PIXI.Application) {
        super(effect, app);

        this.effectType = EffectType.BlackHole;
        this.color = 0x000000;
        this.blackHoleEffect = effect;
    }

    public redraw() {
    }

    public onStart(): void {
        let x = this.blackHoleEffect.gravSource.x;
        let y = this.blackHoleEffect.gravSource.y;

        const r = BlackHoleEffect.radius;

        this.gfx!.moveTo(x, y)
            .beginFill(this.color)
            .drawCircle(r, r, r)
            .endFill();
        this.gfx!.x = x;
        this.gfx!.y = y;
        this.gfx!.pivot.x = r;
        this.gfx!.pivot.y = r;
        console.log(x); console.log(y);
    }

    public onEnd(): void {
        this.remove();
    }
}

@EffectDrawable.register
export class DefensiveWallEffectDrawable extends EffectDrawable {
    effectType: EffectType;
    private color: number;
    private wall!: WallDrawable;
    wallEffect: DefensiveWallEffect;

    constructor(effect: DefensiveWallEffect, app: PIXI.Application) {
        super(effect, app);

        this.effectType = EffectType.DefensiveWall;
        this.color = 0xff0000;
        this.wallEffect = effect;
    }

    public redraw() {

    }

    public onStart(): void {
        this.wall = new WallDrawable(this.wallEffect.wall, this.app, this.color);
    }

    public onEnd(): void {
        this.wall.remove();
    }
}