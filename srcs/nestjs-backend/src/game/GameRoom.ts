import { Logger } from '@nestjs/common';
import { BroadcastOperator, Socket } from 'socket.io';
import Game from './shared/util/Game';
import { GameEvents } from './shared/util/Game';
import { Utils } from './shared/util/Utils';
import Vector2 from "./shared/util/Vector2";
import Powerup from "./shared/game_objects/powerups/Powerup";
import {
  ServerGameState,
  ServerGameStateMachine,
} from './state/ServerGameStateMachine';
import { GameService } from './game.service';

class GameRoom {
  private game: Game;
  private stateMachine: ServerGameStateMachine;

  private _id: string;
  private gameEnded: boolean = false;
  private gameStarted: boolean = false;
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
    settings: {
      winCondition: string;
      type: string;
    },
    private gameService: GameService,
    private shutoff: Function,
  ) {
    this.pingBuffers = {};
    this.clientPings = {};
    this.socket = socket;
    this.id = roomID;

    this.spectators = new Map<string, any>();
    this.game = new Game(settings.winCondition, settings.type);
    this.stateMachine = new ServerGameStateMachine(
      this.game,
      ServerGameState.Waiting,
    );

    this.game.on(GameEvents.GameUpdate, (frame) => this.update(frame));
    this.game.on(GameEvents.BallScore, (data) => {
      this.stateMachine.changeGameState(ServerGameState.Scoring, data);
    });
    this.game.on(GameEvents.GameEnd, (score) => {
      if (this.gameEnded) return;
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

    if (this.game.powerupsON) {
      this.game.on(GameEvents.PaddleBallCollide, () => {
        if (this.game.currentPowerup === null
          && Math.random() <= 0.50) {
          const x = Utils.randomIntFromInterval(Game.powerupBoundsTopLeft.x, Game.powerupBoundsBottomRight.x);
          const y = Utils.randomIntFromInterval(Game.powerupBoundsTopLeft.y, Game.powerupBoundsBottomRight.y);
          const powerupPos = new Vector2(x, y);
          this.game.currentPowerup = new Powerup(this.game.eventHandler, this.game, powerupPos);
        }
      });
    }

    this.game.on(GameEvents.PowerupBallCollide, () => {
      const pos = this.game.ball.pos;
      this.game.currentPowerup.startEffect(pos);
      this.socket.emit('powerupTrigger', {ballpos: {x: pos.x, y: pos.y}});
    });
  }

  private connectAsSpectator(client: Socket, username: string) {
    this.pingBuffers[client.id] = new Array<number>(
      GameRoom.movingAveragePeriod,
    );
    this.spectators.set(client.id, {
      id: client.id,
      username: username,
    });

    client.emit('assignController', { control: [] });

    if (this.gameStarted) client.emit('startGame', {});
  }

  public connection(
    client: Socket,
    username: string,
    spectator: boolean = false,
  ) {
    if (spectator) {
      this.connectAsSpectator(client, username);
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
        this.gameService.userInGame(username, this.id);
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
        this.gameService.userInGame(username, this.id);
        //Start Game
        this.stateMachine.changeGameState(ServerGameState.Running, {});
        this.socket.emit('startGame', {});
        this.gameStarted = true;
      } else {
        this.connectAsSpectator(client, username);
      }
    }
  }

  public disconnect(client: Socket) {
    if (this.spectators.has(client.id)){
      this.spectators.delete(client.id);
      return;
    } 

    if (this.gameEnded) return;
    this.gameEnded = true;

    if (this.settings.test) {
      this.socket.emit('matchEnded', {
        reason: 'tested DC',
        score: this.game.scoreboard,
      });
      this.shutoff();
    }

    if (this.settings.p1 == null || this.settings.p2 == null) {
      if (this.settings.p1 != null)
        this.gameService.userDisconnectOnAbort(this.settings.p1.username);
      if (this.settings.p2 != null)
        this.gameService.userDisconnectOnAbort(this.settings.p2.username);
      this.logger.warn(
        `Aborting match with id ${this.id} because not enough players connected`,
      );
      this.shutoff();
      return;
    }

    if (client.id == this.settings.p1.id) {
      this.socket.emit('matchEnded', {
        winner: this.settings.p2.username,
        reason: 'Won by rage quit (of the other guy)',
        score: this.game.scoreboard,
      });
      this.endMatch(
        this.settings.p2.username,
        this.settings.p1.username,
        99,
        0,
      );
    }
    if (client.id == this.settings.p2.id) {
      this.socket.emit('matchEnded', {
        winner: this.settings.p1.username,
        reason: 'Won by rage quit (of the other guy)',
        score: this.game.scoreboard,
      });
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
    if (this.gameStarted && frame % 3 == 0) {
      const game = this.game;
      let powerup: any = {
        on: false
      };
      if (this.game.currentPowerup != null) {
        powerup = {
          on: true,
          pos: this.game.currentPowerup.pos,
          effect: this.game.currentPowerup.effectIndex
        }
      }
      this.socket.volatile.emit('gameUpdate', {
        frame: frame,
        pings: this.clientPings,
        powerup: powerup,
        p1: { target: { x: game.paddle1.target.x, y: game.paddle1.target.y } },
        p2: { target: { x: game.paddle2.target.x, y: game.paddle2.target.y } },
        ballpos: { x: game.ball.pos.x, y: game.ball.pos.y },
        ballvel: { x: game.ball.velocity.x, y: game.ball.velocity.y },
        magnus: {rotSpeed: game.ball.rotSpeed },
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

  public static get defaultWC() {
    return Game.defaultWC;
  }
}

export default GameRoom;
