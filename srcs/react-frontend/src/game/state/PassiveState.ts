import Game from "../shared/util/Game";
import Whaff from "../Whaff";
import { GameStateMachine } from "./GameStateMachine";
import { IState } from "./StateMachine";

export default class PassiveState implements IState {
  name: string;
  data: any;
  game: Game;

  constructor(game: Game, private whaffInstance: Whaff, machine: GameStateMachine) {
    this.name = "Passive";
    this.game = game;
  }

  onEnter() {}

  onExit() {}

  onUpdate(frame: number) {
    const players = {
      player1: this.game.paddle1,
      player2: this.game.paddle2,
    };

    if (frame % 3 == 0) {
      for (const pkey of this.whaffInstance.controlable) {
        const p = players[pkey as keyof typeof players];
        this.whaffInstance.socket.emit("inputUpdate", {
          target: { x: p.target.x, y: p.target.y },
        });
      }
    }
  }
}
