import axios from 'axios';
import { MDBDropdown, MDBDropdownItem, MDBDropdownMenu, MDBDropdownToggle, MDBIcon } from 'mdb-react-ui-kit';
import React, {ChangeEvent, useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom';
import {io} from 'socket.io-client';
import config from '../../config';
import {useAppSelector} from '../../_helpers/hooks';
import './ChatRoom.css'



interface IProps{
	chanName : string;
}

interface IState{
	// chanName : string;
}

function displayMsg(msg: any) {
	if (msg.content === ""){
		return <>
			<h3 style={{color: 'red'}}> {msg.senderLogin}: BlockedUser</h3>
		</>
	} else {
		return <>
			<h3 style={{color: 'black'}}> {msg.senderLogin}: {msg.content}</h3>
		</>
	}

}

let isInChannel: boolean = false;

function Channel (props:IProps){

	const curr_user = useAppSelector<any>(state => state.user);
	const authentication = useAppSelector<any>(state => state.authentication);
	const [usersInChannel, SetUsersInChannel] = useState<any>([]);
	const [adminsInChannel, SetAdminsInChannel] = useState<any>([]);
	let recv = window.location.href.split("/").pop();

	interface ChannelData {
		id: number;
		name: string;
		ownerId: number;
		userIds: number[];
		userLogins: string[];
		adminIds: number[];
		adminLogins: string[];
		access: string;
	}

	const [channel, setChannel] = useState<ChannelData>();

	useEffect(() => {
		if (recv && recv?.slice(-1) === '#') {
			recv = recv.slice(0, -1);
		}
		console.log(recv);
		axios.get(`${config.apiUrl}/chat/channelData/${recv}`, {
			withCredentials: true,
		}).then((res) => {
			// console.log(res.data);
			setChannel(res.data);
		}).catch((err) => {
			console.log(err.response.data.message)
		});	
	}, [recv]);

	useEffect(() => {
		SetUsersInChannel(channel?.userLogins);
		SetAdminsInChannel(channel?.adminLogins);
	}, [channel])

	const UserMute = () => {

		console.log("mute")
	}

	const userBan = async (event: any, user: string) => {
		let flag = false;
		await axios.post(`${config.apiUrl}/chat/banUser`,
			{
				user: user,
				channel: channel?.name,
			},
			{
				withCredentials: true,
			}).then(() => {}).catch((err) => {
				if (err.response.data.message === "already banned") {
					flag = true;	
				}
				console.log(err)
			});
		if (flag) {
		await axios.post(`${config.apiUrl}/chat/unbanUser`,
			{
				user: user,
				channel: channel?.name,
			},
			{
				withCredentials: true,
			}).then(() => {}).catch((err) => {
					console.log(err);
			});
			return ;	
		}

		return ;
	}

	const userAdmin = (event: any, user: string) => {
		console.log("admin")
		axios.post(`${config.apiUrl}/chat/setAdmin`,
			{
				name: channel?.name,
				login: user
			},
			{
				withCredentials: true,
			}).then(() => {
				SetAdminsInChannel((adminsInChannel: any)  => [...adminsInChannel, user]);
			}).catch((err) => {console.log(err)});
	}



	function isUserBanned(user: string)  {
		let flag = false;
		// axios.get('http://localhost:3002/chat/isUserBanned',
		// 	{
		// 		params: {user: user, channel: channel?.name},
		// 		withCredentials: true,
		// 		}).then((res) => {
		// 			flag = res.data;
		// 		}).catch((err) => {console.log(err)});		

		return flag ;
	}

	return(
		<>
		<div className='chatRoomDiv1_1'>

			<div>
				<p> {channel?.access} </p>
				<p> {channel?.name}</p>
			</div>

			<p className='mb-0 text-start'>Admins</p>
			<div className='chatRoomCo'>
				<div className="channelAdmins row">
					<div className="row">
					{ adminsInChannel && adminsInChannel.map((item: string, i: number) => 	
						<MDBDropdown key={i} group>
							<MDBDropdownToggle tag='a'>
								{item}
							</MDBDropdownToggle>
							<MDBDropdownMenu>
							<MDBDropdownItem link onClick={UserMute}>
								{/* <MDBDropdownLink href='/profile'>My Space</MDBDropdownLink> */}
								<MDBIcon icon="microphone-alt-slash" /> Mute
							</MDBDropdownItem>
								<MDBDropdownItem link onClick={event => userBan(event, item)}>
								{/* <MDBDropdownLink onClick={logout} >Logout</MDBDropdownLink> */}
								<MDBIcon icon="ban" /> Ban / Unban
							</MDBDropdownItem>
							</MDBDropdownMenu>
						</MDBDropdown>
					)}
					</div>
				</div>
			</div>

			<p className='mt-3 mb-0 text-start'>Users</p>
			<div className='chatRoomDeco'>
				<div className="channelUsers">
					{ usersInChannel && usersInChannel.map((item: string, i: number) => 
						<MDBDropdown key={i} group>
							<MDBDropdownToggle tag='a'>
								{item}
							</MDBDropdownToggle>
							<MDBDropdownMenu>
								<MDBDropdownItem link onClick={event => userAdmin(event, item)}>
									<MDBIcon fab icon="superpowers" /> admin
								</MDBDropdownItem>
								<MDBDropdownItem link onClick={UserMute}>
									<MDBIcon icon="microphone-alt-slash" /> Mute / Unmute
								</MDBDropdownItem>
								<MDBDropdownItem link onClick={event => userBan(event, item)}>
									<MDBIcon icon="ban" /> Ban / Unban
								</MDBDropdownItem>
							</MDBDropdownMenu>
						</MDBDropdown>
					)}
				</div>

			</div>

		</div>
	</>
	);
}


// class ChatRoom extends React.Component<IState, IProps>{
// 	constructor(props: IProps){
// 		super(props);
// 		this.state = {chanName: 'room Eric'};
// 	}

function ChannelChat(){

	const curr_user = useAppSelector<any>(state => state.user);
	const authentication = useAppSelector<any>(state => state.authentication);
	let recv = window.location.href.split("/").pop();
	const [socket, setSocket] = useState<any>(null);
	const [msg, setMsg] = useState("");
	const navigate = useNavigate();

	interface Messages{
		id: number;
		content: string;
		reciverType: string;
		senderLogin: string;
		reciverChannelName: string;
	}

	let [history_msg, setHistoryMsg] = useState<Messages[]>([]);

	//conect sockets
	useEffect(() => {
		setSocket(io(`${config.apiUrl}`));
	}, []);

	//listening on join direct message room
	useEffect(() => {
		socket?.on('joinedRoom', (msg: string) => {
			console.log("joined to room", msg);
		});	
	}, [socket]);

	useEffect(() => {
		if (recv !== undefined)	{
			axios.get(`${config.apiUrl}/chat/getChannelMessages/${recv}`,
			{
				withCredentials: true		
			}).then((res) => {
				isInChannel = true;
				setHistoryMsg(res.data);
			}).catch((err) => {
				let error = err.response.data.message;
				console.log(error)
				if (error === "You have been banned from this channel") {
					isInChannel = true;
					setHistoryMsg(history_msg => [...history_msg, {id:0, senderLogin: "TU", content: "TE MAMASTE", reciverChannelName: "", reciverType: ""}]);
				} else {
				navigate('/404');
				}
			});
		}
	}, [recv]);

	//handle writing messge
	const handleMsg = (e: ChangeEvent<HTMLInputElement>) => {
		setMsg(e?.currentTarget?.value);
	}

	//join room
	useEffect(() => {
		if (recv && recv?.slice(-1) === '#')
			recv = recv.slice(0, -1);
		if (recv)
			socket?.emit('joinRoom', recv);
	}, [recv && socket]);

	const send = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const channelName = recv;
		const senderLogin = curr_user?.data?.login;

		if (msg === "")
			return ;
		//remove the message when sended
		setMsg("");

		return axios.post(`${config.apiUrl}/chat/createMessageForChannel/${channelName}`,
			{
				content: msg,
			},
			{
				withCredentials: true
			}
		).then((res) => {
			socket.emit('sendMessage', {sender: senderLogin, room: recv, message: res.data.content})
		}).catch((err) => {
			console.log(err.response.data.message);
		});
	}

	//recive mesages with sockets and append
	useEffect(() => {
		socket?.on('messageFromChannel', (msg: {sender: string, room: string, message: string}) => {

			axios.get(`${config.apiUrl}/users/isUserBlocked/${msg.sender}`, 
				{
					withCredentials: true,
				}
			).then(res => {

				if (res.data) {
					msg.message = "";
				}

				setHistoryMsg(history_msg => [...history_msg,
					{
						id: 0,
						content: msg.message,
						reciverType: "Channel",
						senderLogin: msg.sender,
						reciverChannelName: "asdf"
					}
				]);
			}).catch((err) => {console.log(err.response.data.message)});
		});	
	}, [socket]);

	//autoscroll
	useEffect(() => {
		const el = document.getElementById('chat');
		if (el) {
			el.scrollTop = el.scrollHeight;
		}
	}, [history_msg]);

	// render(){
	return(
		<>
			{ authentication.loggedIn &&
	
			<div className='chatRoomDiv1'>

				<Channel chanName={'ChannelName'}></Channel>

				<div className='chatRoomDisplay'>
					<div id='chat' className='chatRoomDisplayMsg'>
						<div className='chatRoomDisplayMsgUser'>
							{history_msg && history_msg.map((item:Messages, i: number) =>
							<div key={i}>
								{displayMsg(item)}
								{/* <h3 key={i} style={{ color: 'black' }}> {item.senderLogin}: </h3> */}
								{/* <h3>{(item.content === "") ? "Blocked User" : item.content}</h3> */}
							</div>
							)}
						</div>
					</div>
					<div className='chatRoomDisplayMsgBar'>
						<form onSubmit={send}>
							<input onChange={handleMsg} value={msg} className='chatRoomDisplayMsgBarInput' type="text" placeholder="Send message..."/>
						</form>
					</div>
				</div>


			</div>	
			}

		</>

	);
}
// }
export default ChannelChat
