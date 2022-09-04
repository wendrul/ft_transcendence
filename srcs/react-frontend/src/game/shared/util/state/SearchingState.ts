import { GameStateMachine } from "./GameStateMachine";
import { IState } from "./StateMachine";

export default class SearchingState implements IState {
    name: string;
    data: any;


    constructor(machine : GameStateMachine) {
        this.name = "Searching";
    }

    onEnter() {
    }

    onExit() {
    }

    onUpdate(dt: number) {
    }
}
