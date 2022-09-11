import { ICollider, Ray, rayIntersection as lineIntersecton } from "../../util/Collider";
import Vector2 from "../../util/Vector2";
import IGameObject from "../IGameObject";
import Powerup, { PowerupType } from "./Powerup";

@Powerup.register
class CagePowerup extends Powerup {
    type: PowerupType;
    
    constructor(x: number, y: number) {
        super(x, y);
        this.type = PowerupType.Cage;
    }
}

export default CagePowerup;