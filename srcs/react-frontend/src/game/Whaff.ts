import * as PIXI from "pixi.js";
import { io, Socket } from "socket.io-client";

import BallDrawable from "./graphics/BallDrawable";
import PaddleDrawable from "./graphics/PaddleDrawable";
import WallDrawable from "./graphics/WallDrawable";
import { GraphicalDebugger } from "./graphics/Debug";
import Game, { GameEvents } from "./shared/util/Game";
import WhaffHUD from "./graphics/WhaffHUD";
import { GameState, GameStateMachine } from "./state/GameStateMachine";
import config from "../config";
import PowerupDrawable from "./graphics/powerups/PowerupDrawable";
import Powerup from "./shared/game_objects/powerups/Powerup";
import Vector2 from "./shared/util/Vector2";
import { Utils } from "./shared/util/Utils";
import { CageEffect } from "./shared/game_objects/powerups/Effects";
import Effect from "./shared/game_objects/powerups/Effect";
import { EffectDrawable } from "./graphics/powerups/EffectDrawable";
import { LoadEffectDrawablesModule } from "./graphics/powerups/EffectDrawables";
import { GameColors } from "./gameColors";

class Whaff {
  static debugMode: boolean;
  static debugTool: GraphicalDebugger;

  app: PIXI.Application;

  game: Game;
  stateMachine: GameStateMachine;
  hud: WhaffHUD;

  controlable: string[];
  winner: any;
  debugInfo = {
    pings: {},
  };

  socket: Socket;
  currentPowerupDrawable?: PowerupDrawable;
  effectDrawable?: EffectDrawable | null;
  ball!: BallDrawable;

  constructor(
    instantiatedApp: PIXI.Application,
    queryParameters: {
      name: string;
      roomID: string;
      premade: boolean;
      spectator: boolean;
      winCondition: string;
      type: string;
    },
    test = false
  ) {
    LoadEffectDrawablesModule();

    this.socket = io(`${config.apiUrl}/game`, {
      query: { ...queryParameters, test },
    });

    console.log("Creating game");
    this.controlable = [];

    this.defineSocketEvents();
    this.app = instantiatedApp;


    this.game = new Game(queryParameters.winCondition, queryParameters.type);

    this.makeDrawables();

    this.app.stage.interactive = true;
    this.app.stage.on("pointermove", (e) => {
      const players = {
        player1: this.game.paddle1,
        player2: this.game.paddle2,
      };

      const pos = e.data.global;
      for (const pKey of this.controlable) {
        const p = players[pKey as keyof typeof players];
        p.target.x = pos.x;
        p.target.y = pos.y;
      }
    });

    // const i_listener = addKeyListeners("i");
    // i_listener.press = () => {
    //   Whaff.debugMode = !Whaff.debugMode;
    // };
    Whaff.debugMode = false;
    Whaff.debugTool = new GraphicalDebugger(this.app);

    this.hud = new WhaffHUD(this.app, this.game, this.debugInfo);

    console.log("Finished Game setup");

    this.stateMachine = new GameStateMachine(this.game, this);

    this.game.on(GameEvents.GameUpdate, (frame: number) => {
      this.stateMachine.currentState.onUpdate(frame);
    });

    this.game.on(GameEvents.EffectDisable, () => {
      if (this.effectDrawable != null) {
        this.effectDrawable.onEnd();
        this.effectDrawable = null;
      }
    })

    this.game.on(GameEvents.PowerupAbort, () => {
      if (this.effectDrawable != null) {
        this.effectDrawable.onEnd();
        this.effectDrawable = null;
      }
      if (this.currentPowerupDrawable != null) {
        this.currentPowerupDrawable.remove();
      }
    });
  }

  private makeDrawables() {
    const p1 = new PaddleDrawable(this.game.paddle1, this.app);
    const p2 = new PaddleDrawable(this.game.paddle2, this.app);
    
    new WallDrawable(this.game.leftGoal, this.app, GameColors.goal);
    new WallDrawable(this.game.rightGoal, this.app, GameColors.goal);
    this.game.walls.forEach((w) => new WallDrawable(w, this.app, GameColors.wall));
    this.ball = new BallDrawable(this.game.ball, this.app);
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
      this.game.ball.rotSpeed = gameState.magnus.rotSpeed;
      this.game.scoreboard.left = gameState.score.left;
      this.game.scoreboard.right = gameState.score.right;
      this.socket.emit("pingBack", { time: gameState.time });
      this.debugInfo.pings = gameState.pings;
      if (!gameState.powerup.on && this.game.currentPowerup != null) {
        this.game.currentPowerup.abort();
        this.game.currentPowerup = null;

      }
      if (gameState.powerup.on && this.game.currentPowerup == null) {
        const powerupPos = new Vector2(gameState.powerup.pos.x, gameState.powerup.pos.y);
        this.game.currentPowerup = new Powerup(this.game.eventHandler, this.game, powerupPos, gameState.powerup.effect);
        this.currentPowerupDrawable = new PowerupDrawable(this.game.currentPowerup!, this.app);
      }
    });

    this.socket.on('powerupTrigger', (data) => {
      this.game.currentPowerup?.startEffect(new Vector2(data.ballpos.x, data.ballpos.y));
      const drawables = EffectDrawable.GetDrawableImplementations();
      for (const drawableCtor of drawables) {
        this.effectDrawable = new drawableCtor(this, this.game.currentPowerup!.effect, this.app);
        if (this.effectDrawable.effectType === this.game.currentPowerup?.effect.type) {
          break;
        }
        else {
          this.effectDrawable.remove();
          this.effectDrawable = null;
        }
      }
      this.effectDrawable?.onStart();
      this.currentPowerupDrawable?.remove();
    });

    this.socket.on("assignController", (settings) => {
      this.controlable = settings.control;
    });

    this.socket.on("matchEnded", (data) => {
      this.game.gameEnd = true;
      this.stateMachine.changeGameState(GameState.Ending, this.game.scoreboard);
      this.game.scoreboard.left = data.score.left;
      this.game.scoreboard.right = data.score.right;
      this.winner = data.winner;
      this.createEndScreen(data);
      this.socket.disconnect();
    });

    this.socket.on("startGame", () => {
      console.log("Starting game");
      this.stateMachine.changeGameState(GameState.Passive, {});
    });

    this.socket.on('planned-dc', (data) => {
      if (!this.game.gameEnd) {
        this.game.gameEnd = true;
        this.stateMachine.changeGameState(GameState.Ending, {});
        this.createDCScreen({ reason: data.reason });
      }
      this.socket.disconnect()
    });

    this.socket.on("disconnect", () => {
      if (!this.game.gameEnd) {
        this.game.gameEnd = true;
        this.stateMachine.changeGameState(GameState.Ending, {});
        this.createDCScreen({ reason: "disconnected" });
      }
      this.socket.disconnect();
    });

  }

  private createDCScreen(data: any) {
    const backdrop = new PIXI.Graphics();
    this.app.stage.addChild(backdrop);
    backdrop
      .beginFill(0x444444, 0.85)
      .drawRect(0, 0, Game.width, Game.height)
      .endFill();

    const text1 = new PIXI.Text(`Server disconnected the session`, {
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
