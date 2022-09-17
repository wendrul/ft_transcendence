import Ball from "../game_objects/Ball";
import GoalZone from "../game_objects/GoalZone";
import IGameObject from "../game_objects/IGameObject";
import Paddle from "../game_objects/Paddle";
import Effect from "../game_objects/powerups/Effect";
import { CageEffect, LoadEffectsModule } from "../game_objects/powerups/Effects";
import Powerup from "../game_objects/powerups/Powerup";
import Wall from "../game_objects/Wall";
import EventHandler from "./EventHandler";
import { Utils } from "./Utils";
import Vector2 from "./Vector2";


export enum GameEvents {
    BallScore = "ballScore",
    GameUpdate = "gameUpdate",
    PointStart = "pointStart",
    GameEnd = "gameEnd",
    PaddleBallCollide = "paddleBallCollide",
    PowerupBallCollide = "powerupBallCollide",
    EffectDisable = "effectDisable",
    PowerupAbort = "powerupAbort"
}

export default class Game {
  /* Game constants */
  public static readonly width: number = 1300;
  public static readonly height: number = 700;
  public static readonly respawnCooldown = 1500;
  public static readonly deathCooldown = 3000;
  public static readonly defaultWC = 7;

  public static readonly ballStartSpeed = 200;
  public static readonly dt = 1000.0 / 120.0;

  static readonly powerupBoundsTopLeft = new Vector2(200, 200);
  static readonly powerupBoundsBottomRight = new Vector2(Game.width - 200, Game.height - 200);

  /* Logic */
  leftGoal: Wall;
  rightGoal: Wall;
  lastLoser: string;
  scoreboard = { left: 0, right: 0 };

  /* class variables */
  public currentPowerup : Powerup | null = null;
  public gameEnd = false;
  public powerupsON = false;
  public gameObjects: Array<IGameObject> = [];
  private gameTime: number;
  private _currentFrame: number;
  private _paddle1: Paddle;
  private _paddle2: Paddle;
  private _ball: Ball;
  private _walls: Wall[];

  private fieldHeight: number;
  private fieldWidth: number;
  private winCondition: number;
  public get currentFrame(): number {
    return this._currentFrame;
  }
  private set currentFrame(v: number) {
    this._currentFrame = v;
  }
  public get paddle1(): Paddle {
    return this._paddle1;
  }
  public set paddle1(v: Paddle) {
    this._paddle1 = v;
  }

  public get paddle2(): Paddle {
    return this._paddle2;
  }
  public set paddle2(v: Paddle) {
    this._paddle2 = v;
  }

  public get ball(): Ball {
    return this._ball;
  }
  public set ball(v: Ball) {
    this._ball = v;
  }

  public get walls(): Wall[] {
    return this._walls;
  }
  private set walls(v: Wall[]) {
    this._walls = v;
  }

  public eventHandler: EventHandler;

  public updateEvents: Function[] = [];

  constructor(winCondition: string, usePowerups: string) {
    this.gameTime = performance.now();
    
    LoadEffectsModule();

    this._currentFrame = 0;
    this.powerupsON = usePowerups === "power-up";

    this.winCondition = Utils.clamp(parseInt(winCondition), 1, 99);
    this.eventHandler = new EventHandler(GameEvents);

    this.fieldWidth = Game.width;
    this.fieldHeight = Game.height;
    this._paddle1 = new Paddle(
      "whaffer1",
      1,
      this.fieldWidth / 2,
      this.fieldHeight / 2,
      this.eventHandler
    );
    this._paddle2 = new Paddle(
      "whaffer2",
      2,
      this.fieldWidth / 2,
      this.fieldHeight / 2,
      this.eventHandler
    );
    this.lastLoser = Math.random() > 0.5 ? "left" : "right";

    this._ball = new Ball(this.eventHandler);

    this._walls = [];
    const wallHeight = 100;
    const cornerWidth = 50;
    this.walls.push(new Wall(0, 0, Game.width, wallHeight, "bot"));
    this.walls.push(new Wall(0, Game.height - wallHeight, Game.width, wallHeight, "top"));


    this.leftGoal = new GoalZone(0, 0, 100, Game.height, "right", this.eventHandler);
    this.rightGoal = new GoalZone(Game.width - 100, 0, 100, Game.height, "left", this.eventHandler);

    this.ball.colliders.push(...this.walls, this.leftGoal, this.rightGoal);
    this.ball.colliders.push(this.paddle1, this.paddle2);

    this.gameObjects.push(this.paddle1, this.paddle2, this.ball, ...this.walls);

    this.gameLoop();
  }

  private update() {
    const newTime = performance.now();
    let timeElapsed = newTime - this.gameTime;

    if (
      !this.gameEnd &&
      (this.scoreboard.left >= this.winCondition ||
        this.scoreboard.right >= this.winCondition)
    ) {
      this.gameEnd = true;
      this.eventHandler.call_callbacks(GameEvents.GameEnd, this.scoreboard);
    }

    while (timeElapsed > Game.dt) {
      this.currentFrame += 1;

      //EVENT Game Update
      this.eventHandler.call_callbacks(
        GameEvents.GameUpdate,
        this.currentFrame
      );

      for (const object of this.gameObjects) {
        object.update(Game.dt / 10);
      }

      this.gameTime += Game.dt;
      timeElapsed -= Game.dt;
    }
  }

  public addGameObject(object: IGameObject) {
    this.gameObjects.push(object);
  }

  public resetGamePosition() {
    this.ball.reset();
    // this.paddle1.reset();
    // this.paddle2.reset();
  }

  public start() {
    //EVENT point start
    this.eventHandler.call_callbacks(GameEvents.PointStart, this.lastLoser);

    if (this.lastLoser === "right") {
      this.ball.velocity = this.paddle2.pos
        .subtract(this.ball.pos)
        .normalized()
        .scale(Game.ballStartSpeed);
    } else if (this.lastLoser === "left") {
      this.ball.velocity = this.paddle1.pos
        .subtract(this.ball.pos)
        .normalized()
        .scale(Game.ballStartSpeed);
    }
  }

  private gameLoop() {
    this.update();
    if (!this.gameEnd) {
      setTimeout(() => this.gameLoop(), 5);
    }

  }

  public on(eventName: GameEvents, callback: Function) {
    this.eventHandler.on(eventName, callback);
  }
}
