import Ball from "../game_objects/Ball";
import IGameObject from "../game_objects/IGameObject";
import Paddle from "../game_objects/Paddle";
import Wall from "../game_objects/Wall";
import Vector2 from "./Vector2";

export default class Game {
  private static dt = 1000.0 / 60.0;

  private gameObjects: Array<IGameObject> = [];
  private gameTime: number;
  
  private _paddle1 : Paddle;
  fieldHeight: number;
  fieldWidth: number;
  public get paddle1() : Paddle {
    return this._paddle1;
  }
  private set paddle1(v : Paddle) {
    this._paddle1 = v;
  }
  
  private _paddle2 : Paddle;
  public get paddle2() : Paddle {
    return this._paddle2;
  }
  private set paddle2(v : Paddle) {
    this._paddle2 = v;
  }
  
  
  private _ball : Ball;
  public get ball() : Ball {
    return this._ball;
  }
  private set ball(v : Ball) {
    this._ball = v;
  }
  
  
  private _walls : Wall[];
  public get walls() : Wall[] {
    return this._walls;
  }
  private set walls(v : Wall[]) {
    this._walls = v;
  }
  

  constructor(fieldWidth: number, fieldHeight: number) {
    this.gameTime = performance.now();

    this.fieldWidth = fieldWidth;
    this.fieldHeight = fieldHeight;
    this._paddle1 = new Paddle("John", 1, this.fieldWidth / 2, this.fieldHeight / 2);
    this._paddle2 = new Paddle("Jim", 2, this.fieldWidth / 2, this.fieldHeight / 2);
  
    this._ball = new Ball();
    
    this._walls = [];
    this.walls.push(new Wall(50, 0, 900, 100, "bot"));
    this.walls.push(new Wall(50, 500, 900, 100, "top"));
    this.walls.push(new Wall(50, 0, 50, 600, "right"));
    this.walls.push(new Wall(900, 0, 50, 600, "left"));
    
    this.ball.colliders.push(...this.walls);
    this.ball.colliders.push(this.paddle1, this.paddle2);

    this.gameObjects.push(this.paddle1, this.paddle2, this.ball, ...this.walls);
  }

  public update() {
    //TODO find the best way to get time (performance.now()?)
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
}
