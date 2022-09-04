import Game from "../Game";
import { GameState, GameStateMachine } from "./GameStateMachine";
import { IState } from "./StateMachine";

export default class ScoringState implements IState {
    name: string;
    data: any;
    private game: Game;
    private machine: GameStateMachine;

    constructor(game: Game, machine: GameStateMachine) {
        this.name = "Scoring";
        this.game = game;
        this.machine = machine;
    }

    onEnter() {
        const side = this.data.goalSide;
        // Maybe start
        if (side === "left") {
            this.game.scoreboard["right"] += 1;
        }
        else if (side === "right") {
            this.game.scoreboard["left"] += 1;
        }
        else {
            throw new Error(`Scored on invalid side "${side}"`)
        }
        this.game.lastLoser = side;
        //change to End state if any player has scored the win condition
        setTimeout(() => {
            this.machine.changeGameState(GameState.Running, {});
        }, Game.deathCooldown);
    }

    onExit() {
    }

    onUpdate(dt: number) {
    }
}
