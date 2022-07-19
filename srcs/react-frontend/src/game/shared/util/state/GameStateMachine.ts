import MenuState from "./MenuState";
import SearchingState from "./SearchingState";
import RunningState from "./RunningState";
import ScoringState from "./ScoringState";
import EndingState from "./EndingState";

import { IState, StateMachine } from "./StateMachine";
import Game from "../Game";

export class GameStateMachine extends StateMachine {
    currentState: IState;
    private game: Game;

    private menuState!: IState;
    private searchingState!: IState;
    private runningState!: IState;
    private scoringState!: IState;
    private endingState!: IState;

    constructor(game: Game) {
        super();
        this.initStates();

        this.game = game;

        this.currentState = this.menuState;
        this.currentState.onEnter();
    }
    
    private initStates() : void {
        this.menuState = new MenuState();
        this.searchingState = new SearchingState();
        this.runningState = new RunningState(this.game);
        this.scoringState = new ScoringState();
        this.endingState = new EndingState();
    }
}
