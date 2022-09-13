import Game from "../Game";
import { GameStateMachine } from "./GameStateMachine";
import { IState } from "./StateMachine";

export default class EndingState implements IState {
    name: string;
    data: any;
    game: Game;

    constructor(game: Game, machine : GameStateMachine) {
        this.name = "Ending";
        this.game = game;
    }

    onEnter() {
        this.game.pause();
    }

    onExit() {
    }

    onUpdate(dt: number) {
    }
}
