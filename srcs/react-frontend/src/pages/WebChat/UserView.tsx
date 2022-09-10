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

interface Conv{
	id: number;
	login: string;
}


function UserView (props : IProps){
	const dispatch = useAppDispatch();
	const users = useAppSelector<any>(state => state.users);
	const channel = useAppSelector<any>(state => state.channel);
	const [history_conv, setHistoryConv] = useState([]);

	useEffect(() => {
		dispatch(channelActions.getOpenConversations());
	},[]);
	
	useEffect(() => {
		setHistoryConv(channel.data);
	}, [channel.data]);

	const LoadingView  = ()  => {
		return (<div className="d-flex justify-content-center align-items-center mt-4">
		<h1>Loading...</h1>
	</div>)
	}

	const openConvView = () => {{
	return(
			<div className='d-flex flex-column'>
					{history_conv && history_conv.map((item:Conv) => 
				<div key={item.id} className='d-flex flex-row border-bottom m-3 justify-content-between'>
					<div key={item.id} className='d-flex flex-row '>
						<p key={item.id}> {item?.login}</p>
					</div>
					
					<div>
						<button> Play</button>
						<button onClick={() => window.open(window.location.origin + '/direct_message/' + item.login)}>
							Chat
						</button>
					</div>
				</div>
				
				)}
		</div>
		);
	}}


	let view = LoadingView();
	if (props.type == 'conversation'){
		view = openConvView();
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