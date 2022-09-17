import Drawable from "./Drawable";
import * as PIXI from "pixi.js";
import ScoreBoardDrawable from "./ScoreBoardDrawable";
import Game from "../shared/util/Game";
import Whaff from "../Whaff";
import { GameColors } from "../gameColors";

class WhaffHUD {
  scoreBoard: ScoreBoardDrawable;
  debugInfo: DebugHUD;

  constructor(app: PIXI.Application, game: Game, debug: {pings: any}) {
    this.scoreBoard = new ScoreBoardDrawable(game.scoreboard, app);
    this.debugInfo = new DebugHUD(app, debug);

    this.debugInfo.textGfx.x = 115;
    this.debugInfo.textGfx.y = 5;
    this.scoreBoard.textGfx.anchor.x = 0.5;
    this.scoreBoard.textGfx.x = Game.width / 2;
    this.scoreBoard.textGfx.y = 30;
  }
}

class DebugHUD extends Drawable {
  text!: string;
  debug: { pings: any };
  textGfx: PIXI.Text;

  constructor(app: PIXI.Application, debug: { pings: any }) {
    super(app, true);
    this.debug = debug;
    this.textGfx = new PIXI.Text(this.text, {
      fontFamily: "\"Courier New\", Courier, monospace",
      fontSize: 20,
      fill: GameColors.debug,
    });
    this.updateText();
    app.stage.addChild(this.textGfx);
  }

  redraw(): void {
    this.textGfx.text = this.text;
    this.updateText();
    // if (Whaff.debugMode) {
    // } else {
    //   this.textGfx.text = "";
    // }
  }

  updateText() {
    this.text = "Players\n";
    for (const playerName in this.debug.pings) {
      if (Object.prototype.hasOwnProperty.call(this.debug.pings, playerName)) {
        const ping = this.debug.pings[playerName as keyof {}];
        this.text += `${playerName}`.padEnd(15) + `| ${ping}\n`;
      }
    }
  }
}

export default WhaffHUD;
