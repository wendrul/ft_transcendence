import * as PIXI from "pixi.js";
import "@pixi/graphics-extras";
import Drawable from "../Drawable";
import WallDrawable from "../WallDrawable";
import { CageEffect } from "../../shared/game_objects/powerups/Effects";

export default class CageEffectDrawable extends Drawable {
    private color: number;
    private walls: WallDrawable[];
    cageEffect: CageEffect;

    constructor(cageEffect: CageEffect, app: PIXI.Application) {
        super(app, true);
        this.color = 0xffffff;
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