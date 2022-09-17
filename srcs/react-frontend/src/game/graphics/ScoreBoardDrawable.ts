import * as PIXI from "pixi.js";
import { GameColors } from "../gameColors";
import Drawable from "./Drawable";

class ScoreBoardDrawable extends Drawable {
  scoreboard: { left: number; right: number };
  textGfx: PIXI.Text;
  scoreText: string;

  constructor(
    scoreboard: { left: number; right: number },
    app: PIXI.Application
  ) {
    super(app, true);
    this.scoreboard = scoreboard;
    this.scoreText = `${this.scoreboard.left} - ${this.scoreboard.right}`;
    this.textGfx = new PIXI.Text(this.scoreText, {
      fontFamily: "Arial",
      fontSize: 48,
      fill: GameColors.score_text,
      align: "center",
    });
    app.stage.addChild(this.textGfx);
  }

  redraw(): void {
    const txt = `${this.scoreboard.left} - ${this.scoreboard.right}`;
    if (txt != this.scoreText) {
      this.scoreText = txt;
      this.textGfx.text = txt;
    }
  }
}

export default ScoreBoardDrawable;
