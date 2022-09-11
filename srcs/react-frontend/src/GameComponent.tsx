import React, { useRef, useEffect, ChangeEvent, useState} from "react";
import { Application } from "pixi.js";
import { gameSetup } from "./game/pong";
import Game from "./game/shared/util/Game";
import { io } from "socket.io-client";

export function GameSettingsTest(params: any) {
  // const username = useRef(null);
  // const matchID = useRef(null);
  // const isSpectator = useRef(null);
  // const isPremade = useRef(null);

  // const playnow = (e: any) => {
  //   console.log(username.current);    
  // };



  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
    setData({...data, ready: true});
    
      //*aqui pones el codigo que quieras hacer
  }

  const [data, setData] = useState({Username: "", MatchID: "", Premade: false, Spectator: false, ready: false});  

  const handleChangeUsername = function(event: ChangeEvent<HTMLInputElement>) {
    setData({...data, Username: event?.currentTarget?.value});
  }

  const handleChangeMatchID = function(event: ChangeEvent<HTMLInputElement>) {
    setData({...data, MatchID: event?.currentTarget?.value});
  }

  // const handleChangeSpectator = function(event: ChangeEvent<HTMLInputElement>) {
  //   setData({...data, Spectator: event?.currentTarget?.value});
	// }
/*
  const handleChangePremade = function(event: ChangeEvent<HTMLInputElement>) {
    setData({...data, Premade: event?.currentTarget?.value});
	}
*/
  const [boolTwo, SetBoolTwo] = useState(false);
  const [boolTwo2, SetBoolTwo2] = useState(false);
  const toggleSwitch = () => SetBoolTwo((previousState:boolean) => !previousState);
  const toggleSwitch2 = () => SetBoolTwo2((previousState:boolean) => !previousState);

  const handleSpectator = function(event: ChangeEvent<HTMLInputElement>) {
    console.log(event)
    console.log(boolTwo)
    toggleSwitch()
    setData({...data, Spectator: !boolTwo});
	}

  const handlePremade = function(event: ChangeEvent<HTMLInputElement>) {
    console.log(event)
    console.log(boolTwo2)
    toggleSwitch2()
    setData({...data, Premade: !boolTwo2});
	}

  return (
    <div>
      {!data.ready && <form onSubmit={onSubmit}>
        <label>Username: </label>
        <input onChange={handleChangeUsername} type="text"></input>
        <br />

        <label>Match ID: </label>
        <input onChange={handleChangeMatchID} type="text"></input>
        <br />

        <label>Spectator: </label>
        <input onChange={handleSpectator} type="checkbox"></input>
        <br />

        <label>Premade: </label>
        <input onChange={handlePremade} type="checkbox"></input>
        <br />

        <input
          type='submit'
          value="Play"
        ></input>
        <br/>
      </form>}
        {data.ready && <GameComponent username={data.Username} roomID={data.MatchID} spectator={data.Spectator} premade={data.Premade}></GameComponent>}
    </div>
  );
}

function GameComponent(props: any) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // On first render create our application
    const app = new Application({
      width: Game.width,
      height: Game.height,
      backgroundColor: 0x5bba6f,
      // resolution: 2,
      antialias: true,
    });

    // Add app to DOM
    ref.current?.appendChild(app.view);
    // Start the PixiJS app
    app.start();
    const query = {
      name: props.username,
      roomID: props.roomID,
      premade: props.premade,
      spectator: props.spectator,
    }
    if (props.test === undefined) gameSetup(app, query, false);
    else gameSetup(app, query, true);
    return () => {
      // On unload completely destroy the application and all of it's children
      app.destroy(true, true);
    };
  }, []);

  return <div ref={ref} />;
}

export default GameComponent;