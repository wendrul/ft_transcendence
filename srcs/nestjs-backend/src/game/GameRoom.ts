import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import Game from './shared/util/Game';
import { GameEvents } from './shared/util/Game';
import { Utils } from './shared/util/Utils';
import {
  GameState,
  GameStateMachine,
} from './shared/util/state/GameStateMachine';

class GameRoom {
  private game: Game;
  private stateMachine: GameStateMachine;

  private socket;
  private settings = {
    p1: null,
    p2: null,
  };
  private serverside_settings = { spectators: [] };
  private pingBuffers: any;
  private clientPings: any;
  static movingAveragePeriod: number = 30;

  constructor(socket: Socket) {
    this.pingBuffers = {};
    this.clientPings = {};
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
    if (this.settings.p1 == null) { //condition must be less arbitrary
      this.settings.p1 = client.id;
      this.pingBuffers[client.id] = new Array<number>(GameRoom.movingAveragePeriod);
      client.emit('assignController', { control: ['player1'] });
    } else if (this.settings.p2 == null) {
      this.settings.p2 = client.id;
      this.pingBuffers[client.id] = new Array<number>(GameRoom.movingAveragePeriod);
      client.emit('assignController', { control: ['player2'] });
    } else {
      this.pingBuffers = new Array<number>(GameRoom.movingAveragePeriod);
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

  public onPingback(client, data) {
    const ping = performance.now() - data.time;
    this.pingBuffers[client.id].push(ping);
    this.pingBuffers[client.id].shift(1);
    switch (client.id) {
      case this.settings.p1:
        this.clientPings[this.game.paddle1.name] = Math.round(Utils.mean(
          this.pingBuffers[client.id],
        ));
        break;
      case this.settings.p2:
        this.clientPings[this.game.paddle2.name] = Math.round(Utils.mean(
          this.pingBuffers[client.id],
        ));
        break;
      default:
        break;
    }
  }

  private update(frame: number) {
    if (frame % 6 == 0) {
      const game = this.game;
      this.socket.emit('gameUpdate', {
        frame: frame,
        pings: this.clientPings,
        p1: { target: { x: game.paddle1.target.x, y: game.paddle1.target.y } },
        p2: { target: { x: game.paddle2.target.x, y: game.paddle2.target.y } },
        ballpos: { x: game.ball.pos.x, y: game.ball.pos.y },
        ballvel: { x: game.ball.velocity.x, y: game.ball.velocity.y },
        score: this.game.scoreboard,
        time: performance.now(),
      });
    }
  }
}

export default GameRoom;
