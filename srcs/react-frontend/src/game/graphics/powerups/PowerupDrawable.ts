import * as PIXI from "pixi.js";
import "@pixi/graphics-extras";
import Drawable from "../Drawable";
import WallDrawable from "../WallDrawable";
import Powerup from "../../shared/game_objects/powerups/Powerup";

export default class PowerupDrawable extends Drawable {
    private color: number;
    private walls: WallDrawable[];
    powerup: Powerup;

    constructor(powerup: Powerup, app: PIXI.Application) {
        super(app, true);
        this.color = 0xff0000;
        this.walls = [];
        this.powerup = powerup;
    }

    public redraw() {
        this.gfx.clear();
        // this.gfx.x = this.powerup.pos.x;
        // this.gfx.y = this.powerup.pos.y;
        
        this.gfx.beginFill(this.color)
            .drawRect(this.powerup.pos.x -  Powerup.sideLength / 2, 
                this.powerup.pos.y -  Powerup.sideLength / 2, 
                      Powerup.sideLength, 
                      Powerup.sideLength)
            .endFill();

    }
}