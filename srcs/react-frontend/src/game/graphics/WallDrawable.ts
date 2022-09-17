import * as PIXI from "pixi.js";
import "@pixi/graphics-extras";

import Wall from "../shared/game_objects/Wall";
import IDrawable from "./IDrawable";
import Drawable from "./Drawable";
import Vector2 from "../shared/util/Vector2";
import addKeyListeners from "../shared/util/Interaction";
import { ICollider, Ray } from "../shared/util/Collider";
import IGameObject from "../shared/game_objects/IGameObject";
import Whaff from "../Whaff";
import { GameColors } from "../gameColors";

export default class WallDrawable extends Drawable {
    private wall: Wall;
    private color: number;

    constructor(wall: Wall, app: PIXI.Application, color = 0x496085) {
        super(app, true);
        this.wall = wall;
        this.color = color;
    }

    private get pos(): Vector2 {
        return this.wall.pos;
    }
    private get width(): number {
        return this.wall.width;
    }
    private get height(): number {
        return this.wall.height;
    }
    private get colliderSide(): string {
        return this.wall.colliderSide;
    }
    private get colliderRay(): Ray {
        return this.wall.colliderRay;
    }


    public redraw() {
        this.gfx!.clear();
        this.gfx!.beginFill(this.color)
            .drawRect(this.pos.x, this.pos.y, this.width, this.height)
            .endFill();

        if (Whaff.debugMode) {
            const line_width = 10;
            const rotation_dir =
                this.colliderSide === "right" || this.colliderSide === "top"
                    ? Math.PI / 2
                    : -Math.PI / 2;
            const col_start = this.colliderRay.pos.add(
                this.colliderRay.dir
                    .normalized()
                    .scale(line_width / 2)
                    .rotate(rotation_dir)
            );
            const col_end = this.colliderRay.dir.add(col_start);
            this.gfx!.moveTo(col_start.x, col_start.y)
                .lineStyle(line_width, GameColors.debug)
                .lineTo(col_end.x, col_end.y)
                .endFill();
        }
    }
}