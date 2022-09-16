import { ICollider, Ray, rayIntersection as lineIntersecton } from "../../util/Collider";
import Game from "../../util/Game";
import Vector2 from "../../util/Vector2";
import IGameObject from "../IGameObject";
import Wall from "../Wall";
import Effect, { EffectType } from "./Effect";
import Powerup from "./Powerup";

export function LoadEffectsModule(){}

@Effect.register
//@CageEffectDrawable.register
export class CageEffect extends Effect {
    walls: Wall[];
    static readonly wallLength = 100; //garbage change
    static readonly wallThickness = 5;
    static readonly durationMs = 3000; //3 seconds

    constructor(game: Game, origin: Vector2) {
        super(game, origin, EffectType.Cage, CageEffect.durationMs);
        this.walls = [];
       
    }

    onStart(ownerIsLeft: boolean, ballpos: Vector2): void {
        this.origin = ballpos;
        const len = CageEffect.wallLength;
        const thic = CageEffect.wallThickness;
        this.walls.push(new Wall(this.origin.x - len/2 - thic, this.origin.y - len/2 - thic, thic, len, "right"));
        this.walls.push(new Wall(this.origin.x - len/2 - thic, this.origin.y - len/2 - thic, len, thic, "bot"));
        this.walls.push(new Wall(this.origin.x + len/2 - thic, this.origin.y - len/2 - thic, thic, len + thic, "left"));
        this.walls.push(new Wall(this.origin.x - len/2 - thic, this.origin.y + len/2 - thic, len + thic, thic, "top"));
        this.game.ball.colliders.push(...this.walls);
    }

    onEnd(): void {
        const del = this.game.ball.colliders.indexOf(this.walls[0]);
        this.game.ball.colliders.splice(del, 4);
    }
}