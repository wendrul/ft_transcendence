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
	const authentication = useAppSelector<any>(state => state.authentication);
	const users = useAppSelector<any>(state => state.users);
	const dispatch = useAppDispatch();
	const recv = window.location.href.split("/").pop();
	let view;
//	let history_msg : any;

		interface Messages{
			id: number,
			content: string,
			reciverType: string,
			senderId: number,
			reciverUserId: number
		}

	const [history_msg, setHistoryMsg] = useState<Messages[]>([
		{ id: 1, content: "hello word", reciverType: "user", senderId: 2, reciverUserId: 3 },
		{ id: 2, content: "goasdasd word", reciverType: "user", senderId: 3, reciverUserId: 2 },
		{ id: 3, content: "nani word", reciverType: "user", senderId: 2, reciverUserId: 3},
		{ id: 4, content: "nani word", reciverType: "user", senderId: 3, reciverUserId: 2},
		{ id: 5, content: "como estas", reciverType: "user", senderId: 2, reciverUserId: 3},
		{ id: 6, content: "hola amigo", reciverType: "user", senderId: 2, reciverUserId: 3}
	])

	useEffect(() => {
		if (recv !== undefined)
			dispatch(userActions.getByLogin(recv));
	//		history_msg = receive();
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

// === CHAT ===

const send = (event: React.FormEvent<HTMLFormElement>) => {
	event.preventDefault();
	const recv_id = users?.item?.id;
	return axios.post(`${config.apiUrl}/chat/createMessageForUser/${recv_id}`,
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
/*
useEffect(() => {
	if (users && users.item)
	{
		let recv_id = users?.item?.id;
		return axios.get(`${config.apiUrl}/chat/getMessagesWith/${recv_id}`,
		{
			withCredentials: true
		}).then(handleResponse).then(message => {
			localStorage.setItem('channel', JSON.stringify(message));
			return message;
		});
	}
},[users]);
*/
/*
const receive = () => {
	const recv_id = users?.item?.id;
	return axios.get(`${config.apiUrl}/chat/getMessagesWith/${recv_id}`,
	{
		withCredentials: true
	}).then(handleResponse).then(message => {
		localStorage.setItem('channel', JSON.stringify(message));
		return message;
	});
}
*/

// === VIEW ===

const LoadingView  = ()  => {
	return (		<div className="d-flex justify-content-center align-items-center mt-4">
	<h1>Loading...</h1>
</div>)
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
	<>
	{ authentication.loggedIn && users.items &&
	<div className='chatRoomDiv1'>

		<Channel chanName={'direct message'}></Channel>
		<div className='chatRoomDisplay'>
			<div className='chatRoomDisplayMsg'>
				<div className='chatRoomDisplayMsgUser'>
					{	history_msg && history_msg.map((item:Messages) =>
						<>
						<h3 key={item.id}> {users.items[item.senderId - 1]?.login}: {item.content}  </h3> 
						</>
					)}
					</div>
				</div>
			<div className='chatRoomDisplayMsgBar'>
					<form onSubmit={send}>
						<input onChange={handleMsg} className='chatRoomDisplayMsgBarInput' type="text" placeholder="Send message"/>
					</form>
			</div>

		</div>
		
	</div>
			
		}
	</>
	)
}

view = LoadingView();

if (users.loged === true &&
	(curr_user?.data?.login !== users?.item?.login)){
		view = defaultView();
}
else if (users.loged === false)
	view = err404View();

return(
	<>
		{view}
	</>
	);
}

export default DirectMessage;