import IDrawable from "./IDrawable";
import * as PIXI from "pixi.js";
import "@pixi/graphics-extras";

export default abstract class Drawable implements IDrawable {
    public isVisible: boolean;

    public gfx: PIXI.Graphics;
    protected app: PIXI.Application;

    constructor(app: PIXI.Application, isVisible: boolean) {
        this.app = app;
        this.gfx = new PIXI.Graphics();
        this.isVisible = isVisible;

        app.ticker.add((delta) => {
            if (this.isVisible) {
                this.redraw();
            }
            else{
                this.gfx.clear();
            }
        });
        this.app.stage.addChild(this.gfx);
    }

    abstract redraw(): void;

    public remove(): void {
        this.app.stage.removeChild(this.gfx);
    }
    // abstract exposeInternalWrappedObj(): any;
}