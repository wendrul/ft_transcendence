import React, { useEffect } from 'react';
import "./CreateRoom.css";
import RoomCreate from './component/RoomCreate';


function CreateRoom(props: { sender:string, roomid:string, userId:number, socket: any }) {

	useEffect(() => {
		document.title = "CreateRoom";
	
	}, [])
  const basicActive = "tab1"

  return (
    <>
      { 1 &&
        <div className="p-5 bd-highlight justify-content-center d-flex">
          <div className="p-2 d-flex flex-column bd-highlight col-example col-md-6 align-items-center justify-content-center h-100 w-100">
           <p className="register_btn mb-3">Create a Room </p>
            <RoomCreate active={basicActive === 'tab1'} sender={props.sender} roomid={props.roomid} userId={props.userId} socketid={props.socket} />
          </div>
        </div>
      }
    </>
  );
}

export default CreateRoom;