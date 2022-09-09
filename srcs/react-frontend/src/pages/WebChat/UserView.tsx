import React, { useState, ChangeEvent, useEffect} from 'react';
import { channelActions, userActions } from '../../_actions';
import { useAppDispatch, useAppSelector } from '../../_helpers/hooks';


const oneBlockUser = () => {{
	return(
		<div className='d-flex flex-row border-bottom m-3 justify-content-between'>
		<div className='d-flex flex-row '>
			<p> blocked user</p>
		</div>
		<div>
		<button className='bg-primary'>Unlock</button>
		</div>
	</div>
	);
}}



interface IProps{
	type: string;
}

function UserView (props : IProps){
	const dispatch = useAppDispatch();

	useEffect(() => {
		console.log('hello');
		dispatch(channelActions.getOpenConversations);
	},[]);


	const convView = () => {{
		return(
			<div className='d-flex flex-row border-bottom m-3 justify-content-between'>
			<div className='d-flex flex-row '>
				<p>  user</p>
			</div>
			<div>
			<button> Play</button>
	
			{/* HERE */}
			<button onClick={() => window.open(window.location.origin + '/direct_message')}>Chat</button>
			
			<button className='bg-danger'>Delete</button>
			</div>
		</div>
		);
	}}


	let view;
	if (props.type == 'conversation'){
		view = convView();
	}
	else if (props.type == 'friends'){
		// view = oneUser(props.type);
	}
	else if (props.type == 'block'){
		view = oneBlockUser();
	}

	return(
		<>
			{view}
		</>
	);
}

export default UserView