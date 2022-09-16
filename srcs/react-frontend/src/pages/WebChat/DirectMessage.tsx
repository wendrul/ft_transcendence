import axios from "axios";
import React, { useRef, useState, ChangeEvent,useEffect } from "react";
import { useAppDispatch, useAppSelector } from '../../_helpers/hooks';
import { userActions } from "../../_actions";
import config from '../../config';
import './ChatRoom.css'
import { user } from "../../_reducers/user.reducer";
import {io} from "socket.io-client";
import CreateRoom from "../CreateRoom/CreateRoom";

interface IProps{
	chanName : string;
	socketid : any;
	userId: number;
	sender: string;
	room: string
}

function Channel (props:IProps){
	return(
		<div className='chatRoomDiv1_1'>
			<div>
				<p> {props.chanName}</p>

				<div className='chatRoomCo2'>
					<div className="channelAdmins row">
						<CreateRoom sender={props.sender} roomid={props.room} userId={props.userId} socket={props.socketid}/>
					</div>
				</div>
			</div>
		</div>
	);
}

function messageWithLink (item: any) {
	return (
		<>
			{item.senderLogin}: <a href={item.content}>{item.content}</a>
		</>
	);

}

function messageWithoutLink (item: any) {
		return (
			<>
				{item.senderLogin}: {item.content}
			</>
		);
}


function DirectMessage(){
	const sendRef = useRef(null);
	const [msg, setMsg] = useState("");
	const [socket, setSocket] = useState<any>(null);

	const curr_user = useAppSelector<any>(state => state.user);
	const authentication = useAppSelector<any>(state => state.authentication);
	const users = useAppSelector<any>(state => state.users);
	const dispatch = useAppDispatch();
	const recv = window.location.href.split("/").pop();
	let view;

	interface Messages{
		id: number;
		content: string;
		reciverType: string;
		senderLogin: string;
		reciverUserLogin: string
	}

	let [history_msg, setHistoryMsg] = useState<Messages[]>([]);

	//conect sockets
	useEffect(() => {
		setSocket(io(`${config.apiUrl}`));
	}, []);

	//listening on join direct message room
	useEffect(() => {
		socket?.on('joinedRoom', (msg: string) => {
		});	
	}, [socket]);


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

	//join room
	let room_name: string;

	useEffect(() => {
		if (curr_user?.data?.id > users?.item?.id) {
			room_name = curr_user?.data?.id + "." + users?.item?.id;
		} else {
			room_name = users?.item?.id + "." + curr_user?.data?.id;
		}
		if (curr_user.data && users.item)
			socket?.emit('joinRoom', room_name);

	}, [curr_user.data && users.item && socket]);

	const send = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const id_user = users?.item?.id;
		const my_id = curr_user?.data?.id;
		
		if(msg === "")
			return ;

		//remove the message when sended
		setMsg("");

		return axios.post(`${config.apiUrl}/chat/createMessageForUser/${id_user}`,
			{
				content : msg,
				curr_user : curr_user.data, //I don't know what is these for (David)
				id : id_user								//I don't know what is these for (David)
			},
			{
				withCredentials: true
			}).then(handleResponse).then(message => {
				return message;
			}).then(message => {
				let room: string;
				if (my_id > id_user)
					room = my_id + "." + id_user;
				else
					room = id_user + "." + my_id;
				socket.emit('sendMessage', {sender: message.senderLogin, room: room, message: message.content});
			}).catch((err) => {
				alert(err.response.data.message);
			});
	}


	//recive mesages with sockets and append
	useEffect(() => {
		socket?.on('messageFromChannel', (msg: {sender: string, room: string, message: string}) => {
			setHistoryMsg(history_msg => [...history_msg,
				{
					id: 0,
					content: msg.message,
					reciverType: "User",
					senderLogin: msg.sender,
					reciverUserLogin: "adsf",
				}
			]);
		});	
	}, [socket]);

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

	//delete mesage on submit
	useEffect(() => {
		const el = document.getElementById('chat');
		if (el) {
			el.scrollTop = el.scrollHeight;
		}
	}, [history_msg]);

	const nani = () => {
		if (curr_user?.data?.id > users?.item?.id) {
			return room_name = curr_user?.data?.id + "." + users?.item?.id;
		} else {
			return room_name = users?.item?.id + "." + curr_user?.data?.id;
		}
	}

	const defaultView = () => {
		return(
			<>
				{ authentication.loggedIn && users.items && 
				<div className='chatRoomDiv1'>

					<Channel chanName={'direct message'} socketid={socket} sender={curr_user?.data?.login} userId={users?.item?.id} room={nani()}></Channel>
					<div className='chatRoomDisplay'>
						<div id='chat' className='chatRoomDisplayMsg'>
							<div className='chatRoomDisplayMsgUser'>
								{	history_msg && history_msg.map((item:Messages, i: number) =>
									<h3 key={i}>
										{(item.content.slice(0, 7) === "http://" || item.content.slice(0, 8) === "https://") ? messageWithLink(item) : messageWithoutLink(item)}
									</h3> 

								)}
							</div>
						</div>
						<div className='chatRoomDisplayMsgBar'>
							<form onSubmit={send}>
								<input onChange={handleMsg} value={msg} className='chatRoomDisplayMsgBarInput' type="text" placeholder="Send message"/>
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
