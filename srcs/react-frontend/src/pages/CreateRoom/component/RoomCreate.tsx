import React, { useState, ChangeEvent } from 'react';
import {
	MDBBtn,
  MDBRadio,
  MDBRange,
  MDBTabsPane
  } from 'mdb-react-ui-kit';
import config from '../../../config';
import axios from 'axios';

function RoomCreate(props: { active: boolean, sender: string , userId:number ,roomid: string, socketid: any}) {

  const [room, setRoom] = useState({
    name: '', //id de la sala
    winCondition: "5", //win condition
    type: 'classic', // type
    spectator: false,
  });

	const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
    let r = (Math.random() + 1).toString(36).substring(3);
    let url = `${window.location.origin}/play-premade/` + r + `?winCondition=${room.winCondition}&type=${room.type}&spectator=${room.spectator}`

    axios.post(`${config.apiUrl}/chat/createMessageForUser/${props.userId}`, //id del usuario al que se le manda el mensaje.
    {
      content : url
    },
    {
      withCredentials: true
    }).then(message => { 
      props.socketid.emit('sendMessage', {sender: props.sender, room: props.roomid, message: url});
    }).catch();

   // props.socketid.emit('sendMessage', {sender: props.sender, room: props.roomid, message: url});
    // generar el name aqui
    // mandar el link en los mensajes.
	//	dispatch(userActions.signup(firstName, lastName, email, password));
	}

  return (
    <>
      <MDBTabsPane show={props.active}>
        <div className="d-flex flex-column align-items-center justify-content-center w-100 pb-5 mb-3">
          <form onSubmit={onSubmit}>
            <div className="register_btn mb-3">
              <p className="register_btn mb-3">
                type
              </p>
              <MDBRadio name='inlineRadio' id='inlineRadio1' onChange={(event: ChangeEvent<HTMLInputElement>) => setRoom({...room, type: "classic"})} label='Classic' defaultChecked inline
              />
              <MDBRadio name='inlineRadio' id='inlineRadio2' onChange={(event: ChangeEvent<HTMLInputElement>) => setRoom({...room, type: "power-up"})} label='Power-up' inline
              />
            </div>
            <div className="register_btn mb-3">
              <p className="register_btn mb-0">
                  Score
                </p>
              <MDBRange
                onChange={(event: ChangeEvent<HTMLInputElement>) => setRoom({...room, winCondition: event?.currentTarget?.value})}
                value={room.winCondition}
                min='1'
                max='9'
                step='1'
                id='customRange3'
            
                labelClass='text-center w-100'
              />
            </div>
            <MDBBtn type='submit' className='mt-4' block>
              create
            </MDBBtn>
          </form>
        </div>
      </MDBTabsPane>
    </>
  );
}

export default RoomCreate;