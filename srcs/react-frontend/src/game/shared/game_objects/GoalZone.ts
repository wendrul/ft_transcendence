import EventHandler from "../util/EventHandler";
import { GameEvents } from "../util/Game";
import Vector2 from "../util/Vector2";
import Wall from "./Wall";

class GoalZone extends Wall {
  private eventHandler: EventHandler;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    side: "top" | "bot" | "left" | "right",
    eventHandler: EventHandler
  ) {
    super(x, y, width, height, side);
    this.eventHandler = eventHandler;
  }

  public onCollision(collidingObject: any): Vector2 {
    // Goal is scored
    this.eventHandler.call_callbacks(GameEvents.BallScore, {
      goalSide: this.colliderSide == "right" ? "left" : "right",
      //The collider side is the line collider of the rectangle,
      //so for the left rectangle it's the right side;
    });
    return new Vector2(0, 0);
  }
}

export default GoalZone;
