import * as PIXI from "pixi.js";
import "@pixi/graphics-extras";
import Drawable from "../Drawable";
import WallDrawable from "../WallDrawable";
import Powerup from "../../shared/game_objects/powerups/Powerup";

const texture = PIXI.Texture.from('https://i.imgur.com/ykglbUE.png');

export default class PowerupDrawable extends Drawable {
    private color: number;
    private walls: WallDrawable[];
    powerup: Powerup;
    sprite: any;

    constructor(powerup: Powerup, app: PIXI.Application) {
        super(app, true);
        this.color = 0xff0000;
        this.walls = [];
        this.powerup = powerup;
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.anchor.set(0.5);
        this.sprite.x = this.powerup.pos.x;
        this.sprite.y = this.powerup.pos.y;
        this.app.stage.addChild(this.sprite);
    }

    public redraw() {
        this.gfx.clear();
        this.sprite.x = this.powerup.pos.x;
        this.sprite.y = this.powerup.pos.y;
        // this.gfx.x = this.powerup.pos.x;
        // this.gfx.y = this.powerup.pos.y;
        
        // this.gfx.beginFill(this.color)
        //     .drawRect(this.powerup.pos.x -  Powerup.sideLength / 2, 
        //         this.powerup.pos.y -  Powerup.sideLength / 2, 
        //               Powerup.sideLength, 
        //               Powerup.sideLength)
        //     .endFill();

    }

    public remove(): void {
        this.app.stage.removeChild(this.gfx);
        this.app.stage.removeChild(this.sprite);
    }
}