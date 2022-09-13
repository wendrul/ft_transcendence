import * as PIXI from "pixi.js";
import { io, Socket } from "socket.io-client";

import addKeyListeners from "./shared/util/Interaction";

import BallDrawable from "./graphics/BallDrawable";
import PaddleDrawable from "./graphics/PaddleDrawable";
import WallDrawable from "./graphics/WallDrawable";
import { GraphicalDebugger } from "./graphics/Debug";
import Game, { GameEvents } from "./shared/util/Game";
import WhaffHUD from "./graphics/WhaffHUD";
import { GameState, GameStateMachine } from "./state/GameStateMachine";

class Whaff {
  static debugMode: boolean;
  static debugTool: GraphicalDebugger;
  
  app: PIXI.Application;
  
  game: Game;
  stateMachine: GameStateMachine;
  hud: WhaffHUD;
  
  controlable: string[] = [];
  winner: any;
  debugInfo = {
    pings: {},
  };
  
  socket: Socket;

  constructor(
    instantiatedApp: PIXI.Application,
    queryParameters: {
      name: string;
      roomID: string;
      premade: boolean;
      spectator: boolean;
    },
    test = false
  ) {
    this.socket = io(`localhost:3002/game`, {
      query: { ...queryParameters, test },
    });

    this.defineSocketEvents();
    this.app = instantiatedApp;

    this.game = new Game();

    this.makeDrawables();

    const players = {
      player1: this.game.paddle1,
      player2: this.game.paddle2,
    };
    this.app.stage.interactive = true;
    this.app.stage.on("pointermove", (e) => {
      const pos = e.data.global;
      for (const pKey of this.controlable) {
        const p = players[pKey as keyof typeof players];
        p.target = pos;
      }
    });

    const i_listener = addKeyListeners("i");
    i_listener.press = () => {
      Whaff.debugMode = !Whaff.debugMode;
    };
    Whaff.debugMode = false;
    Whaff.debugTool = new GraphicalDebugger(this.app);
    
    this.hud = new WhaffHUD(this.app, this.game, this.debugInfo);

    console.log("Finished Game setup");

    
    this.stateMachine = new GameStateMachine(this.game, this);
    this.game.on(GameEvents.GameUpdate, (frame: number) => {
      this.stateMachine.currentState.onUpdate(frame);
    });
  }

  private makeDrawables() {
    const p1 = new PaddleDrawable(this.game.paddle1, this.app);
    const p2 = new PaddleDrawable(this.game.paddle2, this.app);
    const players = {
      player1: this.game.paddle1,
      player2: this.game.paddle2,
    };
    const ball = new BallDrawable(this.game.ball, this.app);
    this.game.walls.forEach((w) => new WallDrawable(w, this.app));
    new WallDrawable(this.game.leftGoal, this.app, 0x00ffff);
    new WallDrawable(this.game.rightGoal, this.app, 0x00ffff);
  }

  private defineSocketEvents() {
    this.socket.on("gameUpdate", (gameState: any) => {
      if (!this.controlable.includes("player1")) {
        this.game.paddle1.target.x = gameState.p1.target.x;
        this.game.paddle1.target.y = gameState.p1.target.y;
      }
      if (!this.controlable.includes("player2")) {
        this.game.paddle2.target.x = gameState.p2.target.x;
        this.game.paddle2.target.y = gameState.p2.target.y;
      }
      this.game.ball.pos.x = gameState.ballpos.x;
      this.game.ball.pos.y = gameState.ballpos.y;
      this.game.ball.velocity.x = gameState.ballvel.x;
      this.game.ball.velocity.y = gameState.ballvel.y;
      this.game.ball.magnusForce.y = gameState.magnus.force;
      this.game.ball.omega = gameState.magnus.omega;
      this.game.scoreboard.left = gameState.score.left;
      this.game.scoreboard.right = gameState.score.right;
      this.socket.emit("pingBack", { time: gameState.time });
      this.debugInfo.pings = gameState.pings;
    });
    this.socket.on("assignController", (settings) => {
      console.log(settings);
      this.controlable = settings.control;
    });
    this.socket.on("matchEnded", (data) => {
      this.stateMachine.changeGameState(GameState.Ending, this.game.scoreboard);
      this.game.scoreboard.left = data.score.left;
      this.game.scoreboard.right = data.score.right;
      this.winner = data.winner;
      this.createEndScreen(data);
    });
    this.socket.on("startGame", () => {
      this.stateMachine.changeGameState(GameState.Passive, {});
    });
  }

  private createEndScreen(data: any) {
    const backdrop = new PIXI.Graphics();
    const score = this.hud.scoreBoard.textGfx;
    this.app.stage.addChild(backdrop);
    backdrop
      .beginFill(0x444444, 0.85)
      .drawRect(0, 0, Game.width, Game.height)
      .endFill();

    this.app.stage.removeChild(score);
    this.app.stage.addChild(score);
    score.x = Game.width / 2;
    score.y = Game.height / 2 - 100;

    const text1 = new PIXI.Text(`${this.winner} is the winner!`, {
      fontFamily: '"Courier New", Courier, monospace',
      fontSize: 40,
      fill: 0xeeeeee,
    });
    text1.anchor.x = 0.5;
    text1.anchor.y = 0.5;
    text1.x = Game.width / 2;
    text1.y = Game.height / 2;
    this.app.stage.addChild(text1);

    if (data.reason != undefined) {
      const text2 = new PIXI.Text(`${data.reason}`, {
        fontFamily: '"Courier New", Courier, monospace',
        fontSize: 25,
        fill: 0xeeeeee,
      });
      text2.anchor.x = 0.5;
      text2.anchor.y = 0.5;
      text2.x = Game.width / 2;
      text2.y = Game.height / 2 + 40;
      this.app.stage.addChild(text2);
    }
  }
}

export default Whaff;
