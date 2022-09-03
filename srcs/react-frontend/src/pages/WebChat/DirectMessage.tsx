import axios from "axios";
import React, { useState, ChangeEvent } from "react";
import config from '../../config';
import { user } from "../../_reducers/avatar.reducer";
import {UpdateUser} from "../../interfaces/iUser";
import { useAppSelector } from '../../_helpers/hooks';
import './ChatRoom.css'

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
	const [receiver, setReceiver] = useState("");
	const user = useAppSelector<any>(state => state.user);
	const owner : UpdateUser = user.data;

	const handleMsg = function (e: ChangeEvent<HTMLInputElement>)  {
		setMsg(e?.currentTarget?.value);
	}

	const handleReceiver = function (e: ChangeEvent<HTMLInputElement>)  {
		setReceiver(e?.currentTarget?.value);
	}

	function handleResponse(response:any) {
    if(response.status == 400)
    {
        const error = response.message || response.statusText;
        return Promise.reject(error);
    }
    return response.data;
}
const recv = function (event: React.FormEvent<HTMLFormElement>) {
	return axios.post(`${config.apiUrl}/chat/getMessageWith/${receiver}`,
	{
		content : msg,
		user : owner,
		id : receiver
	},
	{
		withCredentials: true
	}).then(handleResponse).then(message => {
		localStorage.setItem('channel', JSON.stringify(message));
		return message;
	});
}
	const send = function (event: React.FormEvent<HTMLFormElement>) {
	return axios.post(`${config.apiUrl}/chat/sendMessageForUser/${receiver}`,
	{
		content : msg,
		user : owner,
		id : receiver
	},
	{
		withCredentials: true
	}).then(handleResponse).then(message => {
		localStorage.setItem('channel', JSON.stringify(message));
		return message;
	});
}

	return(
		<div className='chatRoomDiv1'>

			<Channel chanName={'direct message'}></Channel>
			<div className='chatRoomDisplay'>
							<div className='chatRoomDisplayMsg'>
								<div className='chatRoomDisplayMsgUser'>
									{/* MESSAGE */}

								</div>
							</div>
							<div className='chatRoomDisplayMsgBar'>
								<form onSubmit={send}>
								<input onChange={handleReceiver} className='chatRoomDisplayMsgBarInput' type="number" placeholder="To"/>
								<input onChange={handleMsg} className='chatRoomDisplayMsgBarInput' type="text" placeholder="Send message"/>
								</form>
							</div>
						</div>


		</div>	
	)
}

export default DirectMessage;