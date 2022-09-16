import { ICollider, Ray, rayIntersection as lineIntersecton } from "../../util/Collider";
import Game from "../../util/Game";
import Vector2 from "../../util/Vector2";
import Ball from "../Ball";
import IGameObject from "../IGameObject";
import Effect from "./Effect";

//powerups are 20px by 20px squares that have a 10% spawn chance on every paddle + ball collision
//powerups despawn after 5 seconds, or upon collision with ball
//position must be random, center is 45 pixels inset from boundaries of game (walls/goals)
//need to create functions to get corners and center of the game

class Powerup implements IGameObject, ICollider {
    pos: Vector2;
    effect: Effect;
    static readonly sideLength = 30;

    timeout: any;

    constructor(game: Game, pos: Vector2);
    constructor(game: Game, pos: Vector2, effect: Effect);
    constructor(game: Game, pos: Vector2, effect?: Effect) {
        this.pos = pos.clone();
        this.effect = effect ?? new (this.getRandomEffect())(game, pos.clone());
    }

    public update(delta: number) {
    }

    public intersectRay(ray: Ray): Vector2 | null {
        return null;
    }

    public normal(incoming: Vector2): Vector2 {
        return new Vector2(0, 0);
    }

    public onCollision(ball: Ball): Vector2 {
        const ownerIsLeft = ball.velocity.x > 0;

        this.effect.onStart(ownerIsLeft);
        this.timeout = setTimeout(() => this.effect.onEnd(ownerIsLeft), this.effect.durationMs);

        return new Vector2(0, 0);
    }

    public abortEffect() {
        clearTimeout(this.timeout);
    }

    public wouldPointCollide(oldPos: Vector2, newPos: Vector2): boolean {
        return false;
    }

    private randomIntFromInterval(min: number, max: number) { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    public getRandomEffect() {
        const effects = Effect.GetImplementations();
        let i = this.randomIntFromInterval(0, effects.length - 1);
        return effects[i];
    }
}

export default Powerup;