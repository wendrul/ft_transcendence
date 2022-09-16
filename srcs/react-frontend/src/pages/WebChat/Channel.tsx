import React, { useState, ChangeEvent, useEffect} from 'react';
import Popup from 'reactjs-popup';
import "./Channel.css";
import { alertActions, userActions } from '../../_actions';
import { useAppDispatch, useAppSelector } from '../../_helpers/hooks';
import {channelActions} from '../../_actions/channel.actions'
import {UpdateUser} from "../../interfaces/iUser";
import {IJoinChan} from "../../interfaces/IJoinChan";
import { users } from '../../_reducers/users.reducer';
import {wait} from '@testing-library/user-event/dist/utils';
import axios from 'axios';
import config from '../../config';

interface channelInterface {
	id: number;
	name: string;
}

function Channel (){
	const [type, setType] = useState("public");
	const [chanName, setChanName] = useState("");
	const [edit, setEdit] = useState("");
	const [password, setPassword] = useState("");
	const [usersLogin, setUsersLogin] = useState("");
	const [allChannel, setAllChannel] = useState<channelInterface[]>([]);
	const [inputSearch, setInputSearch] = useState("");
	const [actualJoinAccess, setActualJoinAccess] = useState("");
	const dispatch = useAppDispatch();
	const user = useAppSelector<any>(state => state.user);
	const channel = useAppSelector<any>(state => state.channel);
	const owner: UpdateUser = user.data;
	let view;
	let searchView;

	useEffect(()=> {
		dispatch(channelActions.getMyChannelsByType(type));
	},[type]);

	useEffect(()=> {
		setAllChannel(channel.data);
	},[channel.data]);

	useEffect(() => {
		dispatch(alertActions.clear());
	}, [dispatch])


	const handleChanType = (s: string) => {{
		setType(s);
	}}

	const handleEdit = (e: ChangeEvent<HTMLInputElement>) => {{
		let res : string =  e?.currentTarget?.value;
		setEdit(res);
	}}
	const handleChanName = function (e: ChangeEvent<HTMLInputElement>)  {
		setChanName(e?.currentTarget?.value);
	}

	const handlePassword = function (e: ChangeEvent<HTMLInputElement>)  {
		setPassword(e?.currentTarget?.value);
	}

	const handleUsersLogin = function (e: ChangeEvent<HTMLInputElement>)  {
		setUsersLogin(e?.currentTarget?.value);
	}
	
	const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
		setInputSearch(e?.currentTarget?.value);
	}
	
	const search = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		dispatch(channelActions.getChannel(inputSearch));
	}

	useEffect(() => {
		if(channel?.joined && actualJoinAccess !== "") {
			setAllChannel(allChannel => [...allChannel, {id: channel?.search?.id, name: channel?.search?.name, access: actualJoinAccess}]);

		if (actualJoinAccess === "protected")
			setType("protected");
		else if (actualJoinAccess === "private")
			setType("private");
		else if (actualJoinAccess === "public")
			setType("public");

		}
	},[channel.joined])

	const join = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		let join_pass = e.currentTarget.join_pass?.value;
		let join_access = channel?.search?.access;
		let join_data :IJoinChan = {
			name: channel?.search?.name,
		}
		join_data.password = join_pass;
		if (type === "private")
			join_data.password = ""

		setActualJoinAccess(join_access);
		dispatch(channelActions.joinChannel(join_data));
	}
	
	// useEffect(() => {
	// 	if (channel?.created) {
	// 		window.location.reload();
	// 	}
	// }, [channel.created]);


	// const createPublicChan = (event: React.FormEvent<HTMLFormElement>) => {
	// 	event.preventDefault();
	// 	 dispatch(channelActions.createChannel(
	// 		[],
	// 		'public',
	// 		'',
	// 		chanName,
	// 		owner
	// 	));
	// }

	const createChannel = (e: React.FormEvent<HTMLFormElement>, access: string) => {
		e.preventDefault();
		axios.post(`${config.apiUrl}/chat/createChannel`,
			{
				name: chanName,		
				userLogins: (access === "private") ? parseUser(usersLogin) : [],
				access: access,
				password: password,
			},
			{
				withCredentials: true,
			}).then((res) => {
				// setAllChannel(allChannel => [...allChannel, res.data]);
				window.location.reload();	
			}).catch((e) => {
				alert(e.response.data.message);
			});

	}

	const channelFinded = () => {
		const access : string = channel.search.access;
		const name :string = channel.search.name;
		const userIds = channel.search.userIds;

		return (
			<>
			<p className='mx-2'> {access} channel:</p>
			<p className='mx-3' style={{color : "orange"}}> {name} </p>
			<form onSubmit={join}>
				{access === "protected" &&
					<input name="join_pass" type="password" placeholder='Enter password'/>
				}
				<button onClick={() => join}> Join </button>
			</form>
			{/* <button onClick={() =>  window.open(window.location.origin + '/chat_room/' + name)}>Chat</button> */}
			<button onClick={() =>  window.location.href=window.location.origin + '/chat_room/' + name}>Chat</button>
			</>
		);
	}

	const channelNoFinded = () => {
		return (
			<div className='FriendSearch'>
						<div>
						</div>
			</div> 
		);
	}


	// const createProtectChan = (event: React.FormEvent<HTMLFormElement>) => {
	// 	event.preventDefault();
	// 	console.log("pass: " + password);
	// 	if (password !== ""){
	// 	 dispatch(channelActions.createChannel(
	// 		[],
	// 		'protected',
	// 		password,
	// 		chanName,
	// 		owner
	// 	));
	// 	}
	// 	else
	// 		alert("Enter a password please");
	// }

	const parseUser = (users:string):string[] => {
		let res :string[];
		res = users.split('/');
		return (res);
	}

	// const createPrivateChan = (event: React.FormEvent<HTMLFormElement>) => {
	// 	event.preventDefault();
	// 	const users :string[] = parseUser(usersLogin);
	// 	console.log(users);
	// 	 dispatch(channelActions.createChannel(
	// 		users,
	// 		'private',
	// 		'',
	// 		chanName,
	// 		owner
	// 	));
	// }

	const leave = (event: any, name: string) => {
		event.preventDefault();
		axios.get(`${config.apiUrl}/chat/leaveChannel/${name}`, 
			{
				withCredentials: true,
			}).then(() => {
				setAllChannel(allChannel.filter(item => item.name !== name));
			}).catch((err) => {
				alert(err.response.data.message);
			})
	}

	const displayChannel = () =>{


		const removePass = (e: any, id :string) => {
			e.preventDefault();
			// dispatch(channelActions.removePassChan(id));
			// window.location.reload();
			axios.get(`${config.apiUrl}/chat/removePasswordForChannel/${id}`,
				{
					withCredentials: true,
				}).then(() => {
					setAllChannel(allChannel.filter(item => item.id !== parseInt(id)));
				}).catch((e) => {
					alert(e.response.data.message);
				})
		}

		const editPass = (e:any, id:string) =>{
			e.preventDefault();
			// dispatch(channelActions.editPassChan(id, edit));
			// window.location.reload();
			axios.patch(`${config.apiUrl}/chat/changePasswordForChannel/${id}`,
				{
					password: edit,
				},
				{
					withCredentials: true,
				}).then(() => {
					if (type === "public" || type === "private") {
						setAllChannel(allChannel.filter(item => item.id !== parseInt(id)));
					}		
				}).catch((e) => {
					alert(e.response.data.message);
				});
		}
		return(
			<>
			{((channel && channel?.data && channel?.data[0]) || (channel && channel?.joined)) && allChannel && allChannel.map((item: any, i: number) =>
			<div key={i} className='d-flex flex-row border-bottom m-3 justify-content-between'>
				<div className='d-flex flex-row '>
					<p> {item?.name} </p>
					{user.data.login === item?.ownerId &&
						<p className='text-muted mx-3'> owner</p>
					}
				</div>
			<div className='d-flex flex-row'>
				<button className="mx-4 bg-primary" onClick={() =>  window.location.href=window.location.origin + '/chat_room/' + item?.name}>Chat</button>
				<button onClick={event => leave(event, item?.name)}>Leave</button>
				{item?.access === "protected" &&
					<>
					<form onSubmit={(e) => editPass(e, item?.id)}>
						<input  className="h-100" onChange={handleEdit} type="password"  placeholder='Edit Password'/>
						<button className="h-100" onClick={(e) => editPass(e, item?.id)}> Edit Pass</button>
					</form>
					<button className="h-100 bg-danger" onClick={(e) => removePass(e, item?.id)}> Remove Pass</button>
					</>
				}
				{(item?.access === "public" || item?.access === "private") &&
					<form onSubmit={(e) => editPass(e, item?.id)}>
						<input className="h-100" onChange={handleEdit} type="password"  placeholder='Add Password'/>
						<button className="h-100" onClick={(e) => editPass(e, item?.id)}> Add Pass</button>
					</form>
				}
				</div>
			</div>
			)}
			</>
		);
	}
		
	const ViewProtect = () =>{
		return(
			<>
			<div className='d-flex flex-row m-3'>
				<div>
					<p> Protected channel</p>
				</div>
				<div className='mx-2'>
	
			<Popup trigger={<button className="button"> + </button>} modal>
				<div className='channelPopup'>
					<form onSubmit={event => createChannel(event, "protected")} className='d-flex flex-column align-items-center justify-content-center'>
	
						<div>
							<input onChange={handleChanName} type="text" name="type" placeholder='Channel name'/>
						</div>
						<div>
							<input onChange={handlePassword} type="password" name="type" placeholder='Password'/>
						</div>

						<input type="submit" value="Envoyer" />
					</form>
				</div>
			</Popup>
	
				</div>
		</div> 
		
		<div id="allChannel">
			{displayChannel()}
		</div>
		</>
		);
	}
	
	
	const ViewPublic = () => {
		return(
			<>
			<div className='d-flex flex-row m-3'>
				<div>
					<p> Public channel</p>
				</div>
				<div className='mx-2'>
	
					<Popup trigger={<button className="button"> + </button>} modal>
						<div className='channelPopup'>
							<form onSubmit={event => createChannel(event, "public")} className='d-flex flex-column align-items-center justify-content-center'>
	
								<div>
									<input  onChange={handleChanName} type="text" name="type" placeholder='Channel name'/>
								</div>
			
								<input type="submit" value="Submit"/>
							</form>
						</div>
					</Popup>
				</div>
		</div> 
		
		<div id="allChannel">
			{displayChannel()}
		</div>
		</>
		);
	}
	
	const ViewPrivate = () => {
		return(
			<>
			<div className='d-flex flex-row m-3'>
				<div>
					<p> Private channel</p>
				</div>
				<div className='mx-2'>
	
					<Popup trigger={<button className="button"> + </button>} modal>
						<div className='channelPopup'>
							<form onSubmit={event => createChannel(event, "private")} className='d-flex flex-column align-items-center justify-content-center'>
	
								<div>
									<input  onChange={handleChanName} type="text" name="type" placeholder='Channel name'/>
								</div>

								<div className='d-flex flex-column'>
									<input  onChange={handleUsersLogin} type="text" name="type" placeholder='User login'/>
									<label style={{color: "white"}}> format: user1/user2/user3</label>
								</div>
			
								<input type="submit" value="Submit"/>
							</form>
						</div>
					</Popup>
				</div>
		</div> 
		
		<div id="allChannel">
			{displayChannel()}	
		</div>
		</>
		);
	}

	if (type === 'public')
		view = ViewPublic();
	else if (type === 'protected')
		view = ViewProtect();
	else if (type === 'private')
		view = ViewPrivate();

	if (channel && channel.search)
		searchView = channelFinded();
	else
		searchView = channelNoFinded();

	return (
		<div className='webchatDiv3'>

			<div className='webchatDiv3_1'>
				<div className='webchatDiv3_1_1'>
					<div>
						<button onClick={() => handleChanType('public')}> PUBLIC</button>
					</div>
					<div>
						<button onClick={() => handleChanType('protected')}> PROTECTED</button>
					</div>
					<div>
						<button onClick={() => handleChanType('private')}> PRIVATE</button>
					</div>

				</div>
				<div className='webchatDiv3_1_2'>
					<form onSubmit={search}>
						<input onChange={handleSearch} className='mx-3' type="text" placeholder="search channel"/>
					</form>
					{searchView}
				</div>
			</div>

			<div className='webchatDiv3_2'>
				{view}
			</div>

		</div> 
	);
}

export default Channel;
