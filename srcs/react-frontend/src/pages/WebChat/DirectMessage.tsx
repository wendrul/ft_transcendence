import axios from "axios";
import React, { useRef, useState, ChangeEvent,useEffect } from "react";
import { useAppDispatch, useAppSelector } from '../../_helpers/hooks';
import { userActions } from "../../_actions";
import config from '../../config';
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

interface Messages{
	id: number,
	content: string,
	reciverType: string,
	senderId: number,
	reciverUserId: number
}

function DirectMessage(){
	const sendRef = useRef(null);
	const [msg, setMsg] = useState("");
	let [history_msg, setHistoryMsg] = useState<Messages[]>([]);
	const curr_user = useAppSelector<any>(state => state.user);
	const authentication = useAppSelector<any>(state => state.authentication);
	const users = useAppSelector<any>(state => state.users);
	const dispatch = useAppDispatch();
	const recv = window.location.href.split("/").pop();
	let view;

	const receive = () => {
		const id_user = users.item?.id;
		return axios.get(`${config.apiUrl}/chat/getMessagesWith/${id_user}`,
		{
			withCredentials: true
		}).then(handleResponse).then(res => {
				setHistoryMsg(res);
			return res;
		});
	}

	useEffect(() => {
		if (recv !== undefined)
			dispatch(userActions.getByLogin(recv));
	},[]);

	useEffect(() => {
		if (users.item?.id !== undefined)
			receive()
	},[users.item]);

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

const createMessageFor = (event: React.FormEvent<HTMLFormElement>) => {
	event.preventDefault();
	const id_user = users?.item?.id;
	return axios.post(`${config.apiUrl}/chat/createMessageForUser/${id_user}`,
	{
		content : msg,
		curr_user : curr_user.data,
		id : id_user
	},
	{
		withCredentials: true
	}).then(handleResponse).then(message => {
		return message;
	});
}

const send = (event: React.FormEvent<HTMLFormElement>) => {
	createMessageFor(event);
}

// === VIEW ===

const LoadingView  = ()  => {
	return (<div className="d-flex justify-content-center align-items-center mt-4">
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
					
						<h3 key={item.id}> {users.items[item.senderId - 1]?.login}: {item.content}  </h3> 
						
					)}
					</div>
				</div>
			<div className='chatRoomDisplayMsgBar'>
					<form id="form_chat" onSubmit={send}>
						<input ref={sendRef} onChange={handleMsg} className='chatRoomDisplayMsgBarInput' type="text" placeholder="Send message"/>
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