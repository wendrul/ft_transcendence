import { IState } from "./StateMachine";

export default class SearchingState implements IState {
    name: string;
    data: any;


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
