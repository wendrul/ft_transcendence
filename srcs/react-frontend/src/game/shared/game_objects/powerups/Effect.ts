import { ICollider, Ray, rayIntersection as lineIntersecton } from "../../util/Collider";
import Game from "../../util/Game";
import Vector2 from "../../util/Vector2";
import IGameObject from "../IGameObject";
import Powerup from "./Powerup";

export enum EffectType {
    Cage = "The ball is trapped!", //creates cage around ball for 3 seconds
    BlackHole = "A black hole has appeared in the goal!", //adds gravity towards opponent goal
    DefensiveWall = "That's not fair...", //creates wall behind ball where powerup was picked up for 3 seconds
    Invisiball = "Where did it go?" //makes ball invisible for 1 second
}

abstract class Effect implements IGameObject {
    game: Game;
    type: EffectType;
    origin: Vector2;
    durationMs: number;
    isStarted: boolean;

    public static newDrawable: Function | null = null;

    constructor(game: Game, origin: Vector2, type: EffectType, durationMs: number) {
        this.game = game;
        this.origin = origin;
        this.type = type;
        this.durationMs = durationMs;
        this.isStarted = false;
    }

    update(dt: number): void {
        throw new Error("Method not implemented.");
    }

    abstract onStart(ownerIsLeft: boolean, ballpos: Vector2): void;
    abstract onEnd(): void;
}
export default Effect;

namespace Effect {
    type Constructor<T> = {
        new(game: Game, origin: Vector2): T;
        readonly prototype: T;
    }

    const implementations: Constructor<Effect>[] = [];
    export function GetImplementations(): Constructor<Effect>[] {
        return implementations;
    }

    export function register<T extends Constructor<Effect>>(ctor: T) {
        implementations.push(ctor);
        return ctor;
    }
}