export interface IState {
  name: string;
  data: any;
  onEnter: () => void;
  onExit: () => void;
  onUpdate: (dt: number) => void;
}

export abstract class StateMachine {
  abstract currentState: IState;

  protected changeState(newState: IState) {
    this.currentState.onExit();
    this.currentState = newState;
    this.currentState.onEnter();
  }
}
