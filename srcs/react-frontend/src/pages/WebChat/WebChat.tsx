import "./WebChat.css";
import User from './User';
import Channel from './Channel';
import React, { useEffect, useState} from "react";
import { useAppDispatch, useAppSelector } from '../../_helpers/hooks';
import { friendActions } from "../../_actions";



function WebChat (){
	const authentication = useAppSelector<any>(state => state.authentication);
	const users = useAppSelector<any>(state => state.users);
	const [page, setPage] = useState('user');
	const dispatch = useAppDispatch();

	const handlePage = (s:string) => {
		setPage(s);
	};

	useEffect(() => {
		dispatch(friendActions.getFriends())
	},[])

	return(
<>
{ authentication.loggedIn && users.items &&
	<div className='webchatDiv1'>
		<div className='webchatDiv2'>

			<div className='webchatDiv2_1'>
				<p> My Profile</p>
			</div>

			<div className='webchatDiv2_2'>
			<div className='mt-5'>
					<button onClick={() => handlePage('user')}> USERS </button>
				</div>
				<div className='mt-5'>
				<button onClick={() => handlePage('channel')}> CHANNEL</button>
				</div>
			</div>

		</div>
		{page == 'user' ? <User></User> : <Channel></Channel>}

	</div>
}

	{authentication.loggingIn &&
		<div className="d-flex justify-content-center align-items-center mt-4">
			<h1>Loading...</h1>
		</div>
	}

	{!authentication.loggedIn && !authentication.loggingIn &&
		<div className="d-flex justify-content-center align-items-center mt-4">
			<h1>404 Error</h1>
		</div>
	}
</>
	);
}
export default WebChat;