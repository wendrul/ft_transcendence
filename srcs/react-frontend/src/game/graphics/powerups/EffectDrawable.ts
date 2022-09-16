import Effect, { EffectType } from "../../shared/game_objects/powerups/Effect";
import Drawable from "../Drawable";
import * as PIXI from "pixi.js";

export abstract class EffectDrawable extends Drawable {
    effect: Effect;
    abstract effectType: EffectType;
    constructor(effect: Effect, app: PIXI.Application) {
        super(app, true);
        this.effect = effect;
    }

    abstract onStart(): void;
    abstract onEnd(): void;
}

export namespace EffectDrawable {
    type DrawableConstructor<T> = {
        new(...args: any[]): T; // (Effect, PIXI.Application)
        readonly prototype: T;
    }

    const drawables: DrawableConstructor<EffectDrawable>[] = [];
    export function GetDrawableImplementations(): DrawableConstructor<EffectDrawable>[] {
        return drawables;
    }

    export function register<T extends DrawableConstructor<EffectDrawable>>(ctor: T) {
        drawables.push(ctor);
        return ctor;
    }
}