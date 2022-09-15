import SearchingState from "./SearchingState";
import EndingState from "./EndingState";
import PassiveState from "./PassiveState";

import { IState, StateMachine } from "./StateMachine";
import Game from "../shared/util/Game";
import Whaff from "../Whaff";

export enum GameState {
  Searching,
  Running,
  Scoring,
  Ending,
  Passive,
}

export class GameStateMachine extends StateMachine {
  currentState!: IState;

  public searchingState!: IState;
  public endingState!: IState;
  public passiveState!: IState;

  constructor(private game: Game, private whaffInstance: Whaff) {
    super();
    this.initStates();

    this.currentState = this.searchingState;
    this.currentState.onEnter();
  }

  private initStates(): void {
    this.searchingState = new SearchingState(this.game, this.whaffInstance, this);
    this.endingState = new EndingState(this.game, this);
    this.passiveState = new PassiveState(this.game, this.whaffInstance, this);
  }

  public changeGameState(newGameState: GameState, data: any): void {
    this.searchingState.data = data;
    this.endingState.data = data;
    switch (newGameState) {
      case GameState.Searching:
        this.changeState(this.searchingState);
        break;
      case GameState.Ending:
        this.changeState(this.endingState);
        break;
      case GameState.Passive:
        this.changeState(this.passiveState);  
      break;
    }
  }
}
