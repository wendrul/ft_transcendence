import axios from "axios";
import React, { useState, ChangeEvent,useEffect } from "react";
import config from '../../config';
import { user } from "../../_reducers/user.reducer";
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
	const user = useAppSelector<any>(state => state.users);
	const dispatch = useAppDispatch();
	const owner : UpdateUser = curr_user.data;
	const url = window.location.href;
	const recv_id = url.split("/").pop();

  useEffect(() => {
	// 	//show old conversation
		dispatch(userActions.getById(recv_id));
		// if (user && user?.item)
		// 	console.log("the user exist:" + user?.item?.login)
		// else
		// 	console.log("the user is not existed")
	// 	// if recv_id is not blocked
	}, [user.item]);
	
	const handleMsg = function (e: ChangeEvent<HTMLInputElement>)  {
		setMsg(e?.currentTarget?.value);
	}


	function handleResponse(response:any) {
    if(response.status == 400)
    {
        const error = response.message || response.statusText;
        return Promise.reject(error);
    }
    return response.data;
}
const send = function (event: React.FormEvent<HTMLFormElement>) {
	return axios.post(`${config.apiUrl}/chat/sendMessageForUser/${recv_id}`,
	{
		content : msg,
		curr_user : owner,
		id : recv_id
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
								<input onChange={handleMsg} className='chatRoomDisplayMsgBarInput' type="text" placeholder="Send message"/>
								</form>
							</div>
						</div>


		</div>	
	)
}

export default DirectMessage;