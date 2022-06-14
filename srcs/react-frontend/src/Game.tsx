import React, { useRef, useEffect } from "react";
import { Application } from "pixi.js";
import { gameSetup } from "./game/pong";

function Game() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // On first render create our application
    const app = new Application({
      width: 1000,
      height: 600,
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

export default Game;
