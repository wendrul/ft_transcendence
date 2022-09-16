import React, { useState, useEffect} from 'react';
import { alertActions, channelActions } from '../../_actions';
import { useAppDispatch, useAppSelector } from '../../_helpers/hooks';

interface Friends {
    id:	number;
    firstName: string;
    lastName: string;
    login: string;
    online: boolean;
    inGame: boolean;
	gameRoom: string;
  }

interface IProps{
	type: string;
}

interface Conv{
	id: number;
	login: string;
}


function UserView (props : IProps){
	const dispatch = useAppDispatch();
	// const users = useAppSelector<any>(state => state.users);
	const friends = useAppSelector<any>(state => state.friend);
	const channel = useAppSelector<any>(state => state.channel);
	const [history_conv, setHistoryConv] = useState([]);
	const [allfriends, setfriends] = useState<Friends[]>([]);


	useEffect(() => {
		dispatch(channelActions.getOpenConversations());
	},[]);

	useEffect(() => {
		dispatch(alertActions.clear());
	}, [dispatch])


	useEffect(() => {
		setHistoryConv(channel.data);
	}, [channel.data]);

	useEffect(() => {
		let array: Friends[] = [];
		for(let i = 0; i < friends.friends.length; i++) {
		  const user = friends.friends[i]
		  array.push(user);
		}
		setfriends(array);
	  }, [friends.friends, friends.items])
	

	const LoadingView  = ()  => {
		return (<div className="d-flex justify-content-center align-items-center mt-4">
		<h1>No user</h1>
	</div>)
	}

	function renderElement(Online:boolean, inGame:boolean){
		if(inGame === true)
		   return <p>In Game</p>
		if (Online)
		  return <p>Online</p>
		return <p>Offline</p>
	  }

	const openConvView = () => {
	return(
			<div className='d-flex flex-column'>
					{channel && channel?.data && channel.data && channel.data[0] != null 
						&& history_conv && history_conv.map((item:Conv, i:number) => 
					<div key={i} className='d-flex flex-row border-bottom m-3 justify-content-between'>
						<div  className='d-flex flex-row '>
							<p> {item?.login}</p>
						</div>
						
						<div>
							<button onClick={() => window.location.href=(window.location.origin + '/direct_message/' + item.login)}>
								Chat
							</button>
							<button onClick={() => window.location.href=(window.location.origin + '/profile/' + item.login)}>							
								Profile 
							</button>
						</div>
					</div>
				)}
		</div>
		);
	}

	const oneUser = () => {

		return(
				<div className='d-flex flex-column'>
						{ allfriends && allfriends.map((item:Friends, i:number) =>
						<div key={i} className='d-flex flex-row border-bottom m-3 justify-content-between'>
							<div  className='d-flex flex-row '>
								<p> {item?.login}</p>
							</div>
							<div>
								{renderElement(item?.online, item?.inGame )}
							</div>
							<div>
								<button onClick={() => window.location.href=(window.location.origin + '/direct_message/' + item.login)}>
									Chat
								</button>
								<button onClick={() => window.location.href=(window.location.origin + '/profile/' + item.login)}>							
									Profile 
								</button>
								{ item && item?.inGame &&
									<button onClick={() =>  window.location.href=window.location.origin + '/play-premade/' + item?.gameRoom }>							
										Spectate 
									</button>
								}
							</div>
						</div>
					)}
			</div>
			);
		}


	let view = LoadingView();
	if (props.type === 'conversation'){
		view = openConvView();
	}
	else if (props.type === 'friends'){
		view = oneUser();
	}

	return(
		<>
			{view}
		</>
	);
}

export default UserView
