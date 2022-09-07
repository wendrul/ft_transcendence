import { ICollider, Ray, rayIntersection as lineIntersecton } from "../../util/Collider";
import Vector2 from "../../util/Vector2";
import IGameObject from "../IGameObject";

//center of powerup must be 45 pixels inset from boundaries, random position
export enum PowerupType {
    Cage = "garbage", //creates cage around ball
    BlackHole = "a", //adds gravity towards opponent goal
    DefensiveWall = "a", //creates wall behind ball where powerup was picked up
    
}

abstract class Powerup implements IGameObject, ICollider {
    pos: Vector2;
    abstract type: PowerupType;

    static readonly sideLength = 20;



    constructor(x: number, y: number) {
        this.pos = new Vector2(x, y);
    }

    public update(delta: number) {
    }

    public intersectRay(ray: Ray): Vector2 | null {
        return null;
    }

    public normal(incoming: Vector2): Vector2 {
        return new Vector2(0, 0);
    }

    public onCollision(collidingObject: any): Vector2 {
        return new Vector2(0, 0);
    }

    public wouldPointCollide(oldPos: Vector2, newPos: Vector2): boolean {
        return false;
    }
}

export default Powerup;

namespace Powerup {
    type Constructor<T> = {
        new(...args: any[]): T;
        readonly prototype: T;
    }

    const implementations: Constructor<Powerup>[] = [];
    export function GetImplementations(): Constructor<Powerup>[] {
        return implementations;
    }
    export function register<T extends Constructor<Powerup>>(ctor: T) {
        implementations.push(ctor);
        return ctor;
    }
}