import IGameObject from "../game_objects/IGameObject";

export default class Game {
  private static dt = 1000.0 / 60.0;

  private gameObjects: Array<IGameObject> = [];
  private gameTime: number;

  constructor(objects: Array<IGameObject>) {
    this.gameObjects.push(...objects);
    this.gameTime = new Date().getMilliseconds();
    requestAnimationFrame(this.update);
  }

  private update() {
    const newTime = new Date().getMilliseconds();
    let timeElapsed = newTime - this.gameTime;

    while (timeElapsed > Game.dt) {
      for (const object of this.gameObjects) {
        object.update(Game.dt);
      }

      this.gameTime += Game.dt;
      timeElapsed -= Game.dt;
    }

    requestAnimationFrame(this.update);
  }

  public addGameObject(object: IGameObject) {
    this.gameObjects.push(object);
  }
}
