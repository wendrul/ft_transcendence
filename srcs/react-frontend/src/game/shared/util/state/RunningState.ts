import Game from "../Game";
import { IState } from "./StateMachine";

export default class RunningState implements IState {
    name: string;
    private game: Game;

    constructor(game: Game) {
        this.name = "Running";

        this.game = game;
    }

    onEnter() {
        
    }

    onExit() {
    }

    onUpdate(dt: number) {
    }
}
