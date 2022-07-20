import { IState } from "./StateMachine";

export default class MenuState implements IState {
    name: string;

    constructor() {
        this.name = "Menu";
    }

    onEnter() {
    }

    onExit() {
    }

    onUpdate(dt: number) {
    }
}
