import React, { useState, ChangeEvent} from 'react';
import Popup from 'reactjs-popup';
import "./Channel.css";
import { userActions } from '../../_actions';
import { useAppDispatch, useAppSelector } from '../../_helpers/hooks';
import {channelActions} from '../../_actions/channel.actions'
import {UpdateUser} from "../../interfaces/iUser";
import { users } from '../../_reducers/users.reducer';


function Channel (){
	const [type, setType] = useState("public");
	const [chanName, setChanName] = useState("");
	const [password, setPassword] = useState("");
	const [usersLogin, setUsersLogin] = useState("");
	const dispatch = useAppDispatch();
	const user = useAppSelector<any>(state => state.user);
	const owner: UpdateUser = user.data;
	let view;


	const handleChanType = (s: string) => {{
		setType(s);
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
	
	const createPublicChan = (event: React.FormEvent<HTMLFormElement>) => {
		// event.preventDefault();
		 dispatch(channelActions.createChannel(
			[],
			'public',
			'',
			chanName,
			owner
		));
	}
	const createProtectChan = (event: React.FormEvent<HTMLFormElement>) => {
		// event.preventDefault();

		 dispatch(channelActions.createChannel(
			[],
			'protect',
			password,
			chanName,
			owner
		));
	}

	const createPrivateChan = (event: React.FormEvent<HTMLFormElement>) => {
		// event.preventDefault();

		 dispatch(channelActions.createChannel(
			[usersLogin],
			'private',
			'',
			chanName,
			owner
		));
	}


	function OneChannel(){
		return(
			<div className='d-flex flex-row border-bottom m-3 justify-content-between'>
			<div className='d-flex flex-row '>
				<p> Channel name</p>
			</div>
			<div>
			<button onClick={() => window.open(window.location.origin + '/chat_room')}>Chat</button>
			<button className='bg-danger'>Delete</button>
			</div>
		</div>
		);
	}
	
	
	function ViewProtect(){
		return(
			<>
			<div className='d-flex flex-row m-3'>
				<div>
					<p> Protect channel</p>
				</div>
				<div className='mx-2'>
	
			<Popup trigger={<button className="button"> + </button>} modal>
				<div className='channelPopup'>
					<form onSubmit={createProtectChan} className='d-flex flex-column align-items-center justify-content-center'>
	
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
			{OneChannel()}
			{OneChannel()}
			{OneChannel()}
			{OneChannel()}
			{OneChannel()}
			{OneChannel()}
			{OneChannel()}
			{OneChannel()}
	
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
							<form onSubmit={createPublicChan} className='d-flex flex-column align-items-center justify-content-center'>
	
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
			{OneChannel()}
			{OneChannel()}
			{OneChannel()}
			{OneChannel()}
			{OneChannel()}
			{OneChannel()}
			{OneChannel()}
			{OneChannel()}
	
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
							<form onSubmit={createPrivateChan} className='d-flex flex-column align-items-center justify-content-center'>
	
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
			{OneChannel()}
			{OneChannel()}
			{OneChannel()}
			{OneChannel()}
			{OneChannel()}
			{OneChannel()}
			{OneChannel()}
			{OneChannel()}
	
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
					<input className='mx-3' type="text" placeholder="search channel"/>
				</div>
			</div>

			<div className='webchatDiv3_2'>
				{view}
			</div>

		</div> 
	);
}

export default Channel;