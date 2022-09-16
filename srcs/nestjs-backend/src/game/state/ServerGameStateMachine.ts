import { IState, StateMachine } from './StateMachine';
import Game from '../shared/util/Game';
import { Logger } from '@nestjs/common';

export enum ServerGameState {
  Waiting,
  Running,
  Scoring,
  Ending,
}

export class ServerGameStateMachine extends StateMachine {
  currentState!: IState;
  private game: Game;

  public waitingState!: IState;
  public runningState!: IState;
  public scoringState!: IState;
  public endingState!: IState;

  // private static instance : GameStateMachine;
  // public static getInstance = () => this.instance;

  constructor(game: Game, startingState: ServerGameState) {
    super();
    this.game = game;
    this.initStates();

    switch (startingState) {
      case ServerGameState.Waiting:
        this.currentState = this.waitingState;
        break;
      case ServerGameState.Running:
        this.currentState = this.runningState;
        break;
      case ServerGameState.Scoring:
        this.currentState = this.scoringState;
        break;
      case ServerGameState.Ending:
        this.currentState = this.endingState;
        break;
    }
    this.currentState.onEnter();
  }

  private initStates(): void {
    this.waitingState = new WaitingState(this.game, this);
    this.runningState = new RunningState(this.game, this);
    this.scoringState = new ScoringState(this.game, this);
    this.endingState = new EndingState(this.game, this);
  }

  public changeGameState(newGameState: ServerGameState, data: any): void {
    this.waitingState.data = data;
    this.runningState.data = data;
    this.scoringState.data = data;
    this.endingState.data = data;
    switch (newGameState) {
      case ServerGameState.Waiting:
        this.changeState(this.waitingState);
        break;
      case ServerGameState.Running:
        this.changeState(this.runningState);
        break;
      case ServerGameState.Scoring:
        this.changeState(this.scoringState);
        break;
      case ServerGameState.Ending:
        this.changeState(this.endingState);
        break;
    }
  }
}

class WaitingState implements IState {
  name: string;
  data: any;

  draw: Function | null;
  undraw: Function | null;

  constructor(private game: Game, machine: ServerGameStateMachine) {
    this.name = 'Waiting';
  }

  onEnter() {}

  onExit() {}

  onUpdate(dt: number) {
    Logger.log(`ball: ${this.game.ball.pos}`);
  }
}

class EndingState implements IState {
  name: string;
  data: any;
  game: Game;

  constructor(game: Game, machine: ServerGameStateMachine) {
    this.name = 'Ending';
    this.game = game;
  }

  onEnter() {}

  onExit() {}

  onUpdate(dt: number) {}
}

class RunningState implements IState {
  name: string;
  data: any;
  private game: Game;

  constructor(game: Game, machine: ServerGameStateMachine) {
    this.name = 'Running';

    this.game = game;
  }

  onEnter() {
    this.game.resetGamePosition();
    setTimeout(() => {
      this.game.start();
    }, Game.respawnCooldown);
  }

  onExit() {

  }

  onUpdate(dt: number) {}
}



class ScoringState implements IState {
  name: string;
  data: any;
  private game: Game;
  private machine: ServerGameStateMachine;

  constructor(game: Game, machine: ServerGameStateMachine) {
    this.name = 'Scoring';
    this.game = game;
    this.machine = machine;
  }

  onEnter() {
    const side = this.data.goalSide;
    // Maybe start
    if (side === 'left') {
      this.game.scoreboard['right'] += 1;
    } else if (side === 'right') {
      this.game.scoreboard['left'] += 1;
    } else {
      throw new Error(`Scored on invalid side "${side}"`);
    }
    this.game.lastLoser = side;
    //change to End state if any player has scored the win condition
    setTimeout(() => {
      this.machine.changeGameState(ServerGameState.Running, {});
    }, Game.deathCooldown);
  }

  onExit() {
    if (this.game.currentPowerup != null) {
      this.game.currentPowerup.abort();
      this.game.currentPowerup = null;
    }
  }

  onUpdate(dt: number) {}
}
