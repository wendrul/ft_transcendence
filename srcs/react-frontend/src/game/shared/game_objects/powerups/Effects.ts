import { ICollider, Ray, rayIntersection as lineIntersecton } from "../../util/Collider";
import Game from "../../util/Game";
import Vector2 from "../../util/Vector2";
import IGameObject from "../IGameObject";
import Wall from "../Wall";
import Effect, { EffectType } from "./Effect";
import Powerup from "./Powerup";

export function LoadEffectsModule(){}

@Effect.register
export class CageEffect extends Effect {
    walls: Wall[];
    static readonly wallLength = 30; //garbage change
    static readonly wallThickness = 5;
    static readonly durationMs = 3000; //3 seconds

    constructor(game: Game, origin: Vector2) {
        super(game, origin, EffectType.Cage, CageEffect.durationMs);
        this.walls = [];

        const len = CageEffect.wallLength;
        const thic = CageEffect.wallThickness;
        this.walls.push(new Wall(origin.x - len/2 - thic, origin.y - len/2 - thic, thic, len, "right"));
        this.walls.push(new Wall(origin.x - len/2 - thic, origin.y - len/2 - thic, len, thic, "bot"));
        this.walls.push(new Wall(origin.x + len/2 + thic, origin.y - len/2 - thic, thic, len, "left"));
        this.walls.push(new Wall(origin.x - len/2 - thic, origin.y + len/2 + thic, thic, len, "top"));
    }

    onStart(ownerIsLeft: boolean): void {
        this.game.ball.colliders.push(...this.walls);
    }

    onEnd(ownerIsLeft: boolean): void {
        this.game.ball.colliders.filter((w) => !this.walls.includes(w as Wall));
    }
}