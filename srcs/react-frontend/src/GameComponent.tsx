import React, { useRef, useEffect } from "react";
import { Application } from "pixi.js";
import { gameSetup } from "./game/pong";
import Game from "./game/shared/util/Game";

function GameComponent() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // On first render create our application
    const app = new Application({
      width: Game.width,
      height: Game.height,
      backgroundColor: 0x5bba6f,
      // resolution: 2,
      antialias: true
    });

    // Add app to DOM
    ref.current?.appendChild(app.view);
    // Start the PixiJS app
    app.start();
    gameSetup(app);
    return () => {
      // On unload completely destroy the application and all of it's children
      app.destroy(true, true);
    };
  }, []);

  return <div ref={ref} />;
}

export default GameComponent;
