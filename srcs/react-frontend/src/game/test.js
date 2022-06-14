
import {gameSetup} from "./pong.ts"

const app = new Application({
  width: 800,
  height: 600,
  backgroundColor: 0x5bba6f,
});
gameSetup(app);