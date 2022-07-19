import IDrawable from "./IDrawable";
import * as PIXI from "pixi.js";
import "@pixi/graphics-extras";

export default abstract class Drawable implements IDrawable {
    public isVisible: boolean;

    protected gfx: PIXI.Graphics;
    protected app: PIXI.Application;

    constructor(app: PIXI.Application, isVisible: boolean) {
        this.app = app;
        this.gfx = new PIXI.Graphics();
        this.isVisible = isVisible;

        app.ticker.add((delta) => {
            this.redraw();
        });
        this.app.stage.addChild(this.gfx);
    }

    abstract redraw(): void;
    // abstract exposeInternalWrappedObj(): any;
}