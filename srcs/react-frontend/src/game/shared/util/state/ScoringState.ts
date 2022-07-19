import { IState } from "./StateMachine";

export default class ScoringState implements IState {
    name: string;

    constructor() {
        this.name = "Running";
    }

    onEnter() {
    }

    onExit() {
    }

    onUpdate(dt: number) {
    }
}
