import WallDrawable from "../graphics/WallDrawable";
import Wall from "../shared/game_objects/Wall";
import Game from "../shared/util/Game";
import Vector2 from "../shared/util/Vector2";
import Whaff from "../Whaff";
import { GameStateMachine } from "./GameStateMachine";
import { IState } from "./StateMachine";
import * as PIXI from "pixi.js";
import { GameColors } from "../gameColors";


export default class SearchingState implements IState {
    name: string;
    data: any;
    trainingWall: Wall | undefined;
    trainingWallDrawable: WallDrawable | undefined;
    waitingText: PIXI.Text | undefined;



    constructor(private game: Game, private whaffInstance : Whaff, machine : GameStateMachine) {
        this.name = "Searching";
    }

    onEnter() {
        this.trainingWall = new Wall(Game.width - 300, 0, 20, Game.height, "left");
        this.trainingWallDrawable = new WallDrawable(this.trainingWall, this.whaffInstance.app, GameColors.training_wall);
        this.game.ball.colliders.push(this.trainingWall);

        this.waitingText = new PIXI.Text(`Waiting for player...`, {
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: 25,
            fill: GameColors.text,
          });
          this.waitingText.anchor.x = 0.5;
          this.waitingText.anchor.y = 0.5;
          this.waitingText.x = Game.width / 2;
          this.waitingText.y = Game.height / 2 + 40;
          this.whaffInstance.app.stage.addChild(this.waitingText);

        this.game.ball.reset();
        this.game.ball.velocity = new Vector2(-250, 0);
        this.whaffInstance.controlable = ["player1"];
    }

    onExit() {
        this.game.ball.colliders.pop();
        this.trainingWallDrawable?.remove();
        if (this.waitingText) this.whaffInstance.app.stage.removeChild(this.waitingText);
        this.game.ball.reset();
    }

    onUpdate(dt: number) {
        if (this.game.ball.pos.x < 0) {
            this.game.ball.reset();
            this.game.ball.velocity = new Vector2(-250, 0);
        }
    }
}
