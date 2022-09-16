import { ICollider, Ray, rayIntersection as lineIntersecton } from "../../util/Collider";
import Game from "../../util/Game";
import Vector2 from "../../util/Vector2";
import Ball from "../Ball";
import IGameObject from "../IGameObject";
import Wall from "../Wall";
import Effect, { EffectType } from "./Effect";
import Powerup from "./Powerup";

export function LoadEffectsModule(){}

@Effect.register
export class CageEffect extends Effect {
    walls: Wall[];
    static readonly wallLength = 100;
    static readonly wallThickness = 10;
    static readonly durationMs = 3000;

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

@Effect.register
export class BlackHoleEffect extends Effect {
    static readonly gravStrength = 5;
    static readonly durationMs = 3000;
    static readonly radius = 30;

    gravSource!: Vector2;
    prevVelocity!: Vector2;

    constructor(game: Game, origin: Vector2) {
        super(game, origin, EffectType.BlackHole, BlackHoleEffect.durationMs);
    }

    onStart(ownerIsLeft: boolean, ballpos: Vector2): void {
        this.prevVelocity = this.game.ball.velocity.clone();
        const y = Game.height / 2;
        let dist = BlackHoleEffect.radius * 2;
        let x = ownerIsLeft ? Game.width - dist : dist;

        this.gravSource = new Vector2(x, y);
        
        this.game.ball.blackHoleGravitySource = this.gravSource;
    }

    onEnd(): void {
        this.game.ball.blackHoleGravitySource = null;
    }
}

@Effect.register
export class DefensiveWallEffect extends Effect {
    wall!: Wall;
    static readonly wallThickness = 10;
    static readonly durationMs = 5000;

    constructor(game: Game, origin: Vector2) {
        super(game, origin, EffectType.DefensiveWall, DefensiveWallEffect.durationMs);
    }

    onStart(ownerIsLeft: boolean, ballpos: Vector2): void {
        this.origin = ballpos;

        const thic = DefensiveWallEffect.wallThickness;

        let x = this.origin.x;
        if (ownerIsLeft) x -= thic;

        this.wall = new Wall(x, 0, thic, Game.height, ownerIsLeft ? "left" : "right");
        this.game.ball.colliders.push(this.wall);
    }

    onEnd(): void {
        const del = this.game.ball.colliders.indexOf(this.wall);
        this.game.ball.colliders.splice(del, 1);
    }
}

@Effect.register
export class InvisiballEffect extends Effect {
    static readonly durationMs = 1000;

    constructor(game: Game, origin: Vector2) {
        super(game, origin, EffectType.Invisiball, InvisiballEffect.durationMs);
    }

    onStart(ownerIsLeft: boolean, ballpos: Vector2): void {
        //do nothing
    }

    onEnd(): void {
        //do nothing
    }
}
