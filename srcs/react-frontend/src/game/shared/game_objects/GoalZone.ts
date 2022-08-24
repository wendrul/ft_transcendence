import { GameState, GameStateMachine } from "../util/state/GameStateMachine";
import Vector2 from "../util/Vector2";
import Wall from "./Wall";

class GoalZone extends Wall {
  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    side: "top" | "bot" | "left" | "right"
  ) {
    super(x, y, width, height, side);
  }

  public onCollision(collidingObject: any): Vector2 {
    // Goal is scored
    GameStateMachine.getInstance().changeGameState(GameState.Scoring, {
      goalSide: this.colliderSide == "right" ? "left" : "right"
      //The collider side is the line collider of the rectangle, 
      //so for the left rectangle it's the right side;
    });
    return new Vector2(0,0);
  }
}

export default GoalZone;
