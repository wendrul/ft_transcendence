import * as PIXI from "pixi.js";
import "@pixi/graphics-extras";
import Drawable from "../Drawable";
import WallDrawable from "../WallDrawable";
import { CageEffect, DefensiveWallEffect } from "../../shared/game_objects/powerups/Effects";
import Effect, { EffectType } from "../../shared/game_objects/powerups/Effect";
import { EffectDrawable } from "./EffectDrawable";

export function LoadEffectDrawablesModule(){}

@EffectDrawable.registerDrawable
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
        this.cageEffect.walls.forEach((w)=>this.walls.push(new WallDrawable(w, this.app, this.color)));
    }

    public onEnd(): void {
        this.walls.forEach((w) => {
           this.app.stage.removeChild(w.gfx);
        });
    }
}

@EffectDrawable.registerDrawable
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