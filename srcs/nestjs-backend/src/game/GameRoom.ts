import { Logger } from '@nestjs/common';
import { BroadcastOperator, Socket } from 'socket.io';
import Game from './shared/util/Game';
import { GameEvents } from './shared/util/Game';
import { Utils } from './shared/util/Utils';
import {
  GameState,
  GameStateMachine,
} from './shared/util/state/GameStateMachine';
import { GameService } from './game.service';

class GameRoom {
  private game: Game;
  private stateMachine: GameStateMachine;

  private _id: string;
  private gameEnded: boolean = false;
  public get id(): string {
    return this._id;
  }
  private set id(v: string) {
    this._id = v;
  }

  private socket: Socket;
  private settings = {
    p1: null,
    p2: null,
    test: false,
  };

  private logger = new Logger('GameRoom');

  // private serverside_settings = { spectators: [] };
  private spectators: Map<string, any>;
  private pingBuffers: any;
  private clientPings: any;
  static movingAveragePeriod: number = 30;

  constructor(
    socket: Socket,
    roomID: string,
    private gameService: GameService,
    private shutoff: Function,
  ) {
    this.pingBuffers = {};
    this.clientPings = {};
    this.socket = socket;
    this.id = roomID;

    this.spectators = new Map<string, any>();
    this.game = new Game();
    this.stateMachine = new GameStateMachine(this.game);

    this.game.on(GameEvents.GameUpdate, (frame) => this.update(frame));
    this.game.on(GameEvents.BallScore, (data) => {
      this.stateMachine.changeGameState(GameState.Scoring, data);
    });
    this.game.on(GameEvents.GameEnd, (score) => {
      // this.stateMachine.changeGameState(GameState.Ending, score);
      

      this.gameEnded = true;
      
      if (score.left > score.right) {
        this.socket.emit('matchEnded', {
          winner: this.settings.p1.username,
          reason: 'Won by being better',
          score: this.game.scoreboard,
        });
        if (this.settings.test) return this.shutoff();
        this.endMatch(
          this.settings.p1.username,
          this.settings.p2.username,
          score.left,
          score.right,
        );
      } else {
        this.socket.emit('matchEnded', {
          winner: this.settings.p2.username,
          reason: 'Won by being better',
          score: this.game.scoreboard,
        });
        if (this.settings.test) return this.shutoff();
        this.endMatch(
          this.settings.p2.username,
          this.settings.p1.username,
          score.right,
          score.left,
        );
      }
    });
  }

  public TESTconnection(client: Socket, username: string) {
    this.settings.test = true;
    if (this.settings.p1 == null) {
      this.settings.p1 = {
        id: client.id,
        username: username,
      };
      this.game.paddle1.name = username;
      this.pingBuffers[client.id] = new Array<number>(
        GameRoom.movingAveragePeriod,
      );
      client.emit('assignController', { control: ['player1'] });
    } else if (this.settings.p2 == null) {
      this.settings.p2 = {
        id: client.id,
        username: username,
      };
      this.game.paddle2.name = username;
      this.pingBuffers[client.id] = new Array<number>(
        GameRoom.movingAveragePeriod,
      );
      client.emit('assignController', { control: ['player2'] });
    } else {
      client.disconnect();
    }
  }

  public connection(
    client: Socket,
    username: string,
    spectator: boolean = false,
  ) {
    if (spectator) {
      this.pingBuffers[client.id] = new Array<number>(
        GameRoom.movingAveragePeriod,
      );
      this.spectators.set(client.id, {
        id: client.id,
        username: username,
      });
      client.emit('assignController', { control: [] });
    } else {
      if (this.settings.p1 == null) {
        this.settings.p1 = {
          id: client.id,
          username: username,
        };
        this.game.paddle1.name = username;
        this.pingBuffers[client.id] = new Array<number>(
          GameRoom.movingAveragePeriod,
        );
        client.emit('assignController', { control: ['player1'] });
        this.gameService.userInGame(username);
      } else if (this.settings.p2 == null) {
        this.settings.p2 = {
          id: client.id,
          username: username,
        };
        this.game.paddle2.name = username;
        this.pingBuffers[client.id] = new Array<number>(
          GameRoom.movingAveragePeriod,
        );
        client.emit('assignController', { control: ['player2'] });
        this.gameService.userInGame(username);
      } else {
        this.logger.error('Player tried connecting to a full match');
        client.disconnect();
      }
    }
  }

  public disconnect(client: Socket) {
    if (this.spectators.has(client.id)) this.spectators.delete(client.id);

    if (this.gameEnded) return;

    if (this.settings.test){
      this.socket.emit('matchEnded', {
        reason: 'tested DC',
        score: this.game.scoreboard,
      });
      this.shutoff();
    }

    if (this.settings.p1 == null || this.settings.p2 == null) {
      if (this.settings.p1 != null) this.gameService.userDisconnectOnAbort(this.settings.p1.username);
      if (this.settings.p2 != null) this.gameService.userDisconnectOnAbort(this.settings.p2.username);
      this.logger.warn(
        `Aborting match with id ${this.id} because not enough players connected`,
      );
      this.shutoff();
      return;
    }

    this.gameEnded = true;
    this.socket.emit('matchEnded', {
      reason: 'Won by rage quit (of the other guy)',
      score: this.game.scoreboard,
    });
    if (client.id == this.settings.p1.id) {
      this.endMatch(
        this.settings.p2.username,
        this.settings.p1.username,
        99,
        0,
      );
    }
    if (client.id == this.settings.p2.id) {
      this.endMatch(
        this.settings.p1.username,
        this.settings.p2.username,
        99,
        0,
      );
    }
  }

  public onClientInput(client: Socket, data: any) {
    switch (client.id) {
      case this.settings.p1.id:
        this.game.paddle1.target.x = data.target.x;
        this.game.paddle1.target.y = data.target.y;
        break;
      case this.settings.p2.id:
        this.game.paddle2.target.x = data.target.x;
        this.game.paddle2.target.y = data.target.y;
        break;
      default:
        break;
    }
  }

  public onPingback(client: Socket, data: any) {
    const ping = performance.now() - data.time;
    this.pingBuffers[client.id].push(ping);
    this.pingBuffers[client.id].shift(1);
    switch (client.id) {
      case this.settings.p1.id:
        this.clientPings[this.game.paddle1.name] = Math.round(
          Utils.mean(this.pingBuffers[client.id]),
        );
        break;
      case this.settings.p2.id:
        this.clientPings[this.game.paddle2.name] = Math.round(
          Utils.mean(this.pingBuffers[client.id]),
        );
        break;
      default:
        break;
    }
  }

  private update(frame: number) {
    if (frame % 6 == 0) {
      const game = this.game;
      this.socket.volatile.emit('gameUpdate', {
        frame: frame,
        pings: this.clientPings,
        p1: { target: { x: game.paddle1.target.x, y: game.paddle1.target.y } },
        p2: { target: { x: game.paddle2.target.x, y: game.paddle2.target.y } },
        ballpos: { x: game.ball.pos.x, y: game.ball.pos.y },
        ballvel: { x: game.ball.velocity.x, y: game.ball.velocity.y },
        magnus: { force: game.ball.magnusForce.y, omega: game.ball.omega },
        score: this.game.scoreboard,
        time: performance.now(),
      });
    }
  }

  private endMatch(
    winnerLogin: string,
    looserLogin: string,
    winnerScore: number,
    looserScore: number,
  ) {
    if (this.settings.test) return this.shutoff();

    this.logger.log(`Ending match ${this.id}`);
    this.gameService.addMatchResults(
      winnerLogin,
      looserLogin,
      winnerScore,
      looserScore,
    );
    this.shutoff();
  }

  public getAllConnectedIDs(): string[] {
    const ret = [];

    if (this.settings.p1 != null) ret.push(this.settings.p1.id);
    if (this.settings.p2 != null) ret.push(this.settings.p2.id);
    this.spectators.forEach((spectator) => {
      ret.push(spectator.id);
    });

    return ret;
  }
}

export default GameRoom;
