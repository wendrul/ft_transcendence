import Ball from "../game_objects/Ball";
import GoalZone from "../game_objects/GoalZone";
import IGameObject from "../game_objects/IGameObject";
import Paddle from "../game_objects/Paddle";
import Wall from "../game_objects/Wall";
import Vector2 from "./Vector2";

export default class Game {
  /* Game constants */
  public static width: number = 1000;
  public static height: number = 600;
  public static respawnCooldown = 1500;
  static deathCooldown = 3000;


  private static dt = 1000.0 / 120.0;

  /* Logic */
  leftGoal: Wall;
  rightGoal: Wall;
  lastLoser: string;
  scoreboard = { left: 0, right: 0};

  /* class variables */
  private gameObjects: Array<IGameObject> = [];
  private gameTime: number;

  private _paddle1: Paddle;
  fieldHeight: number;
  fieldWidth: number;
  public get paddle1(): Paddle {
    return this._paddle1;
  }
  public set paddle1(v: Paddle) {
    this._paddle1 = v;
  }

  private _paddle2: Paddle;
  public get paddle2(): Paddle {
    return this._paddle2;
  }
  public set paddle2(v: Paddle) {
    this._paddle2 = v;
  }

  private _ball: Ball;
  public get ball(): Ball {
    return this._ball;
  }
  public set ball(v: Ball) {
    this._ball = v;
  }

  private _walls: Wall[];
  public get walls(): Wall[] {
    return this._walls;
  }
  private set walls(v: Wall[]) {
    this._walls = v;
  }

  constructor() {
    this.gameTime = performance.now();

    this.fieldWidth = Game.width;
    this.fieldHeight = Game.height;
    this._paddle1 = new Paddle(
      "John",
      1,
      this.fieldWidth / 2,
      this.fieldHeight / 2
    );
    this._paddle2 = new Paddle(
      "Jim",
      2,
      this.fieldWidth / 2,
      this.fieldHeight / 2
    );
    this.lastLoser = Math.random() > 0.5 ? "left" : "right";

    this._ball = new Ball();

    this._walls = [];
    this.walls.push(new Wall(50, 0, 900, 100, "bot"));
    this.walls.push(new Wall(50, 500, 900, 100, "top"));
    
    //Debugging cage walls
    // this.walls.push(new Wall(50, 0, 50, 600, "right"));
    // this.walls.push(new Wall(50, 0, 50, 600, "right"));
    
    this.leftGoal = new GoalZone(0, 0, 100, 600, "right");
    this.rightGoal = new GoalZone(900, 0, 100, 600, "left");

    this.ball.colliders.push(...this.walls, this.leftGoal, this.rightGoal);
    this.ball.colliders.push(this.paddle1, this.paddle2);

    this.gameObjects.push(this.paddle1, this.paddle2, this.ball, ...this.walls);
  }

  public update() {
    const newTime = performance.now();
    let timeElapsed = newTime - this.gameTime;

    while (timeElapsed > Game.dt) {
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
    this.paddle1.reset();
    this.paddle2.reset();
  }

  public start() {
    if (this.lastLoser === "right") {
      this.ball.velocity = new Vector2(100, 0)
    }
    else if (this.lastLoser === "left") {
      this.ball.velocity = new Vector2(-100, 0)
    }
  }
}
