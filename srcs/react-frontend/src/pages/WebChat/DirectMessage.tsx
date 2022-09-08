import axios from "axios";
import React, { useState, ChangeEvent,useEffect } from "react";
import config from '../../config';
import {UpdateUser} from "../../interfaces/iUser";
import { useAppDispatch, useAppSelector } from '../../_helpers/hooks';
import './ChatRoom.css'
import { userActions } from "../../_actions";

interface IProps{
	chanName : string;
}

function Channel (props:IProps){
	return(
		<div className='chatRoomDiv1_1'>

			<div>
				<p> {props.chanName}</p>
			</div>


		</div>
	);
}


function DirectMessage(){
	const [msg, setMsg] = useState("");
	const curr_user = useAppSelector<any>(state => state.user);
	const users = useAppSelector<any>(state => state.users);
	const dispatch = useAppDispatch();
	const url = window.location.href.split("/").pop();
	let recv_id;
	let view;

	useEffect(() => {
		if (url !== undefined){
			recv_id = url.match(/\d+/);
			console.log('url: ' + url);
			console.log('in: ' + recv_id);
			dispatch(userActions.getById(recv_id));
		}
		else
			recv_id = 0
			console.log('out: ' + recv_id);
  },[]);

	
const handleMsg = (e: ChangeEvent<HTMLInputElement>) => {
		setMsg(e?.currentTarget?.value);
}


const handleResponse = (response:any) => {
	if(response.status == 400)
	{
	    const error = response.message || response.statusText;
	    return Promise.reject(error);
	}
	return response.data;
}

const send = (event: React.FormEvent<HTMLFormElement>) => {
	return axios.post(`${config.apiUrl}/chat/sendMessageForUser/${recv_id}`,
	{
		content : msg,
		curr_user : curr_user.data,
		id : recv_id
	},
	{
		withCredentials: true
	}).then(handleResponse).then(message => {
		localStorage.setItem('channel', JSON.stringify(message));
		return message;
	});
}


const err404View = () => {
	return(
		<div className="d-flex justify-content-center align-items-center mt-4">
			<h1>404 Error</h1>
		</div>
	)
}

const defaultView = () => {
	return(
	<div className='chatRoomDiv1'>

		<Channel chanName={'direct message'}></Channel>
		<div className='chatRoomDisplay'>

			 <div className='chatRoomDisplayMsg'>
					<div className='chatRoomDisplayMsgUser'>
						{/* HISTORY MESSAGE */}
					</div>
			</div>

			<div className='chatRoomDisplayMsgBar'>
					<form onSubmit={send}>
						<input onChange={handleMsg} className='chatRoomDisplayMsgBarInput' type="text" placeholder="Send message"/>
					</form>
			</div>

		</div>
		
	</div>
	)
}
/*
	constant 

*/
if (users.loaded === false)
	view = err404View();
else
	view = defaultView();

return(
	<>
		{view}
	</>
	);
}

export default DirectMessage;