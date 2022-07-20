export interface IState {
  name: string;
  onEnter: () => void;
  onExit: () => void;
  onUpdate: (dt: number) => void;
}

export abstract class StateMachine {
  abstract currentState: IState;

  constructor() {
  }

  changeState(newState: IState) {
    this.currentState.onExit();
    this.currentState = newState;
    this.currentState.onEnter();
  }
}
