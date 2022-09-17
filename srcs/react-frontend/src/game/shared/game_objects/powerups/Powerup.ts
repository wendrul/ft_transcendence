import { ICollider, Ray, rayIntersection as lineIntersecton } from "../../util/Collider";
import EventHandler from "../../util/EventHandler";
import Game, { GameEvents } from "../../util/Game";
import { Utils } from "../../util/Utils";
import Vector2 from "../../util/Vector2";
import Ball from "../Ball";
import IGameObject from "../IGameObject";
import Wall from "../Wall";
import Effect, { EffectType } from "./Effect";

//powerups are 20px by 20px squares that have a 10% spawn chance on every paddle + ball collision
//powerups despawn after 5 seconds, or upon collision with ball
//position must be random, center is 45 pixels inset from boundaries of game (walls/goals)
//need to create functions to get corners and center of the game

class Powerup implements IGameObject, ICollider {
    pos: Vector2;
    effect: Effect;
    effectIndex : number;
    static readonly sideLength = 100; //garbage change to 30/40
    game: Game;
    hitbox: Wall[]

    timeout: any;

    eventHandler: EventHandler;

    constructor(eventHandler: EventHandler, game: Game, pos: Vector2);
    constructor(eventHandler: EventHandler, game: Game, pos: Vector2, effectIndex: number);
    constructor(eventHandler: EventHandler, game: Game, pos: Vector2, effectIndex?: number) {
        this.eventHandler = eventHandler;
        this.game = game;
        this.pos = pos.clone();
        this.effectIndex = effectIndex ?? this.getRandomEffectIndex();        
        this.effect = new (Effect.GetImplementations()[this.effectIndex])(this.game, this.pos.clone());
        this.hitbox = [];
        const len = Powerup.sideLength;
        const thic = 1;
        this.hitbox.push(new Wall(pos.x - len/2 - thic, pos.y - len/2 - thic, thic, len, "right"));
        this.hitbox.push(new Wall(pos.x - len/2 - thic, pos.y - len/2 - thic, len, thic, "bot"));
        this.hitbox.push(new Wall(pos.x + len/2 + thic, pos.y - len/2 - thic, thic, len, "left"));
        this.hitbox.push(new Wall(pos.x - len/2 - thic, pos.y + len/2 + thic, thic, len, "top"));
        this.game.ball.colliders.push(this);
    }

    public update(delta: number) {
    }

    public intersectRay(ray: Ray): Vector2 | null {
        let ret : Vector2 | null = null;
        for (const w of this.hitbox) {
            if (!w.lastWouldCollide) continue;
            const inter = w.intersectRay(ray);
            if (inter == null) continue;
            if (ret == null || inter.dist(ray.pos) < ret.dist(ray.pos)) {
                ret = inter;
            }
        }
        return ret;
    }

    public normal(incoming: Vector2): Vector2 {
        return new Vector2(0, 0);
    }

    public startEffect(ballpos : Vector2) {
        const ownerIsLeft = this.game.ball.velocity.x > 0;

        this.effect.isStarted = true;
        this.effect.onStart(ownerIsLeft, ballpos);
        this.timeout = setTimeout(() => this.disable(), this.effect.durationMs);
    }

    public onCollision(ball: Ball): Vector2 {
        const del = this.game.ball.colliders.indexOf(this);
        this.game.ball.colliders.splice(del, 1);

        this.eventHandler.call_callbacks(GameEvents.PowerupBallCollide);

        return new Vector2(0, 0);
    }

    private disable() {
        this.eventHandler.call_callbacks(GameEvents.EffectDisable);
        this.effect.onEnd();
        this.game.currentPowerup = null;
    }

    public abort() {
        this.eventHandler.call_callbacks(GameEvents.PowerupAbort);
        if (this.effect.isStarted) {
            clearTimeout(this.timeout);
            this.disable();
        } else {
            const del = this.game.ball.colliders.indexOf(this);
            this.game.ball.colliders.splice(del, 1);

        }
    }

    public wouldPointCollide(oldPos: Vector2, newPos: Vector2): boolean {
        let ret = false;
        this.hitbox.forEach((w) => ret = ret || w.wouldPointCollide(oldPos, newPos));
        return ret;
    }

    public getRandomEffectIndex() {
        const effects = Effect.GetImplementations();
        let i = Utils.randomIntFromInterval(0, effects.length - 1);
        return i;
    }
}

export default Powerup;