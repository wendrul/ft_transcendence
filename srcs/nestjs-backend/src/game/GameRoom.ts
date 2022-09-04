import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import Game from './shared/util/Game';
import { GameEvents } from './shared/util/Game';
import { GameState, GameStateMachine } from './shared/util/state/GameStateMachine';

class GameRoom {
  private game: Game;
  private stateMachine: GameStateMachine;

  private socket;
  private settings = {
    p1: null,
    p2: null,
  };
  private serverside_settings = { spectators: [] };
  constructor(socket: Socket) {
    this.socket = socket;
    this.game = new Game();
    this.stateMachine = new GameStateMachine(this.game);
    this.game.on(GameEvents.GameUpdate, (frame) => this.update(frame));
    this.game.on(GameEvents.BallScore, (data) => {
      // this.socket.emit('scoreGoal', {});
      // emit event if necessary
      this.stateMachine.changeGameState(GameState.Scoring, data);
    });
  }

  public connection(client) {
    if (this.settings.p1 == null) {
      this.settings.p1 = client.id;
      client.emit('assignController', { control: ['player1'] });
    } else if (this.settings.p2 == null) {
      this.settings.p2 == client.id;
      client.emit('assignController', { control: ['player2'] });
    } else {
      this.serverside_settings.spectators.push(client.id);
      client.emit('assignController', { control: [] });
    }
  }

  public disconnect(client) {
    if (client.id == this.settings.p1) {
      this.settings.p1 = null;
    }
    if (client.id == this.settings.p2) {
      this.settings.p2 = null;
    }
    if (this.serverside_settings.spectators.includes(client.id))
      this.serverside_settings.spectators;
  }

  public onClientInput(client, data) {
    switch (client.id) {
      case this.settings.p1:
        this.game.paddle1.target.x = data.target.x;
        this.game.paddle1.target.y = data.target.y;
        break;
      case this.settings.p2:
        this.game.paddle2.target.x = data.target.x;
        this.game.paddle2.target.y = data.target.y;
        break;
      default:
        break;
    }
  }

  private update(frame: number) {
    // Logger.debug(this);
    if (frame % 6 == 0) {
      // update every x frames
      const game = this.game;
      this.socket.emit('gameUpdate', {
        p1: { target: { x: game.paddle1.target.x, y: game.paddle1.target.y } },
        p2: { target: { x: game.paddle2.target.x, y: game.paddle2.target.y } },
        ballpos: { x: game.ball.pos.x, y: game.ball.pos.y },
        ballvel: { x: game.ball.velocity.x, y: game.ball.velocity.y },
        score: this.game.scoreboard,
        timestamp: performance.now(),
        ping: 13,
      });
    }
  }
}

export default GameRoom;
