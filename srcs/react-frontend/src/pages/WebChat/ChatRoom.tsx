import axios from 'axios';
import { MDBDropdown, MDBDropdownItem, MDBDropdownMenu, MDBDropdownToggle, MDBIcon } from 'mdb-react-ui-kit';
import React, {ChangeEvent, useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom';
import {io} from 'socket.io-client';
import config from '../../config';
import { alertActions } from '../../_actions';
import {useAppDispatch, useAppSelector} from '../../_helpers/hooks';
import './ChatRoom.css'



interface IProps{
	chanName : string;
}

// interface IState{
// 	// chanName : string;
// }

function displayMsg(msg: any) {
	if (msg.content === ""){
		return <>
			<h3 style={{color: 'red'}}> {msg.senderLogin}: BlockedUser</h3>
		</>
	} else {
		if (msg.content.slice(0, 7) === "http://" || msg.content.slice(0, 8) === "https://") {
		return <>
			<h3 style={{color: 'black'}}> {msg.senderLogin}: <a href={msg.content}>{msg.content}</a></h3>
		</>
		} else {
			return <>
			<h3 style={{color: 'black'}}> {msg.senderLogin}: {msg.content}</h3>
				</>

		}
	}

}

let isInChannel: boolean = false;

function Channel (props:IProps){

	// const curr_user = useAppSelector<any>(state => state.user);
	// const authentication = useAppSelector<any>(state => state.authentication);
	const [usersInChannel, SetUsersInChannel] = useState<any>([]);
	const [adminsInChannel, SetAdminsInChannel] = useState<any>([]);
	let recv = window.location.href.split("/").pop();

	interface ChannelData {
		id: number;
		name: string;
		ownerId: string;
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
		axios.get(`${config.apiUrl}/chat/channelData/${recv}`, {
			withCredentials: true,
		}).then((res) => {
			setChannel(res.data);
		}).catch();	
	}, [recv]);

	useEffect(() => {
		SetUsersInChannel(channel?.userLogins);
		SetAdminsInChannel(channel?.adminLogins);
	}, [channel])

	const userUnmute = (event: any, user: string) => {
		event.preventDefault();
		axios.post(`${config.apiUrl}/chat/unmuteUser`,
			{
				user: user,
				channel: channel?.name
			},
			{
				withCredentials: true,
			}).then(() => {}).catch((err) => {
				alert(err.response.data.message);
			}); 
	}

	const userMute = (event: any, user: string, time: number) => {
		event.preventDefault();
		axios.post(`${config.apiUrl}/chat/muteUser`, 
			{
				user: user,
				channel: channel?.name,
				time: time
			},
			{
				withCredentials: true, 
			}).then(() => {}).catch((err) => {
				alert(err.response.data.message);
			})
	}

	const userKick = (event: any, user: string) => {
		event.preventDefault();
		axios.post(`${config.apiUrl}/chat/kick`,
			{
				user: user,
				channel: channel?.name,
			},
			{
				withCredentials: true, 
			}).then(() => {
				SetAdminsInChannel(adminsInChannel.filter((item: string) => item !== user));	
				SetUsersInChannel(usersInChannel.filter((item: string) => item !== user));	
			}).catch((err) => {
				alert(err.response.data.message);
			});
	}

	const userBan = async (event: any, user: string) => {
		event.preventDefault();
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
				else {
					alert(err.response.data.message);
				}
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
					alert(err.response.data.message);
				});
			return ;	
		}

		return ;
	}

	const userAdmin = (event: any, user: string) => {
		event.preventDefault();
		axios.post(`${config.apiUrl}/chat/setAdmin`,
			{
				name: channel?.name,
				login: user
			},
			{
				withCredentials: true,
			}).then(() => {
				SetAdminsInChannel((adminsInChannel: any)  => [...adminsInChannel, user]);
			}).catch((err) => {
				alert(err.response.data.message);
			});
	}

	return(
		<>
			<div className='chatRoomDiv1_1'>

				<div>
					<p> {channel?.access} </p>
					<p> {channel?.name}</p>
				</div>
				<p className='mb-0 text-start' > Owner</p>
				<div className='chatRoomOwner'>
					<h6 style={{color: 'white'}}>{channel?.ownerId}</h6>
				</div>
				<p className='mb-0 text-start'>Admins</p>
				<div className='chatRoomCo'>
					<div className="channelAdmins row">
						<div className="row">
							{ adminsInChannel && adminsInChannel.map((item: string, i: number) => 	
							<MDBDropdown key={i}>
								<MDBDropdownToggle tag='a'>
									{item}
								</MDBDropdownToggle>
								<MDBDropdownMenu>
									<MDBDropdownItem link onClick={event => userUnmute(event, item)}>
										<MDBIcon icon="microphone-alt" /> Unmute
									</MDBDropdownItem>
									<MDBDropdownItem link onClick={event => userMute(event, item, 1)}>
										<MDBIcon icon="microphone-alt-slash" /> Mute 1min
									</MDBDropdownItem>
									<MDBDropdownItem link onClick={event => userMute(event, item, 15)}>
										<MDBIcon icon="microphone-alt-slash" /> Mute 15min
									</MDBDropdownItem>
									<MDBDropdownItem link onClick={event => userBan(event, item)}>
										<MDBIcon icon="ban" /> Ban / Unban
									</MDBDropdownItem>
									<MDBDropdownItem link onClick={event => userKick(event, item)}>
										<MDBIcon fas icon="running" /> Kick
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
						<MDBDropdown key={i}>
							<MDBDropdownToggle tag='a'>
								{item}
							</MDBDropdownToggle>
							<MDBDropdownMenu>
								<MDBDropdownItem link onClick={event => userAdmin(event, item)}>
									<MDBIcon fab icon="superpowers" /> admin
								</MDBDropdownItem>
								<MDBDropdownItem link onClick={event => userUnmute(event, item)}>
									<MDBIcon icon="microphone-alt" /> Unmute
								</MDBDropdownItem>
								<MDBDropdownItem link onClick={event => userMute(event, item, 1)}>
									<MDBIcon icon="microphone-alt-slash" /> Mute 1min
								</MDBDropdownItem>
								<MDBDropdownItem link onClick={event => userMute(event, item, 15)}>
									<MDBIcon icon="microphone-alt-slash" /> Mute 15min
								</MDBDropdownItem>
								<MDBDropdownItem link onClick={event => userBan(event, item)}>
									<MDBIcon icon="ban" /> Ban / Unban
								</MDBDropdownItem>
								<MDBDropdownItem link onClick={event => userKick(event, item)}>
									<MDBIcon fas icon="running" /> Kick
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
	const dispatch = useAppDispatch();

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

	useEffect(() => {
		dispatch(alertActions.clear());
	}, [dispatch])


	//listening on join direct message room
	useEffect(() => {
		socket?.on('joinedRoom', (msg: string) => {
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
			socket.emit('sendMessage', {sender: senderLogin, room: (recv && recv?.slice(-1) === '#') ? recv.slice(0, -1) : recv, message: res.data.content})
		}).catch((err) => {
			alert(err.response.data.message);
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
			}).catch();
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
