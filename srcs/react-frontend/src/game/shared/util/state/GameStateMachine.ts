import SearchingState from "./SearchingState";
import RunningState from "./RunningState";
import ScoringState from "./ScoringState";
import EndingState from "./EndingState";

import { IState, StateMachine } from "./StateMachine";
import Game from "../Game";

export enum GameState {
    Searching,
    Running,
    Scoring,
    Ending
}

export class GameStateMachine extends StateMachine {
    currentState: IState;
    private game: Game;

    private searchingState!: IState;
    private runningState!: IState;
    private scoringState!: IState;
    private endingState!: IState;

    // private static instance : GameStateMachine;
    // public static getInstance = () => this.instance;

    constructor(game: Game) {
        super();
        // if (GameStateMachine.instance){
        //     throw new Error("Singleton doubletoned");
        // }
        // GameStateMachine.instance = this;
        this.game = game;
        this.initStates();
        

        this.currentState = this.runningState;
        this.currentState.onEnter();
    }
    
    private initStates() : void {
        this.searchingState = new SearchingState(this);
        this.runningState = new RunningState(this.game, this);
        this.scoringState = new ScoringState(this.game, this);
        this.endingState = new EndingState(this.game, this);
    }

    public changeGameState(newGameState: GameState, data: any): void {
        this.searchingState.data = data;
        this.runningState.data = data;
        this.scoringState.data = data;
        this.endingState.data = data;
        switch (newGameState) {
            case GameState.Searching:
                this.changeState(this.searchingState)
                break;
            case GameState.Running:
                this.changeState(this.runningState)
                break;
            case GameState.Scoring:
                this.changeState(this.scoringState)
                break;
            case GameState.Ending:
                this.changeState(this.endingState)
                break;
        }
    }
}
