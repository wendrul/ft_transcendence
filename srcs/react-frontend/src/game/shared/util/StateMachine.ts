export interface IState {
  name: string;
  onEnter: () => void;
  onExit: () => void;
  onUpdate: (dt: number) => void;
}

export abstract class StateMachine {
  currentState: IState;

  constructor() {
    this.currentState = this.getInitialState();
    this.currentState.onEnter();
  }

  changeState(newState: IState) {
    this.currentState.onExit();
    this.currentState = newState;
    this.currentState.onEnter();
  }

  abstract getInitialState(): IState;
}
