import Game from "../Game";
import { GameStateMachine } from "./GameStateMachine";
import { IState } from "./StateMachine";

export default class RunningState implements IState {
    name: string;
    data: any;
    private game: Game;

    constructor(game: Game, machine : GameStateMachine) {
        this.name = "Running";

        this.game = game;
    }

    onEnter() {
        this.game.resetGamePosition();
        setTimeout(() => {
            this.game.start();
        }, Game.respawnCooldown);
    }

    onExit() {
    }

    onUpdate(dt: number) {
    }
}
