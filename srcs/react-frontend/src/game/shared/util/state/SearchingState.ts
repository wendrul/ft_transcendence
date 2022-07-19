import { IState } from "./StateMachine";

export default class SearchingState implements IState {
    name: string;

    constructor() {
        this.name = "Searching";
    }

    onEnter() {
    }

    onExit() {
    }

    onUpdate(dt: number) {
    }
}
