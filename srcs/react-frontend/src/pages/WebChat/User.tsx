import React, { useState, ChangeEvent, useEffect} from 'react';
import UserView from './UserView';
import { useAppDispatch, useAppSelector } from '../../_helpers/hooks';
import "./User.css";
import { userActions } from '../../_actions';


interface Iprop {
	search : boolean;
}


function User(){
	const [type, setType] = useState("conversation");
	const [userSrch, setUserSrch] = useState('');
	const user = useAppSelector<any>(state => state.users);
	const current_user = useAppSelector<any>(state => state.user);
	const dispatch = useAppDispatch();
	let searchView;

	
	const UserFinded = () => {
		return (
		<div className='FriendSearch'>
						<div>
							<p> user: {user?.item?.login}</p>
						</div>
						<div>
							<button onClick={() => window.open(window.location.origin + '/direct_message/' + user?.item?.id)}> Chat</button>
							<button> Block</button>
							<button> Unblock</button>
						</div>
					</div> 
		);
	}
	const UserNotFinded = () => {
		return (
			<div className='FriendSearch'>
						<div>
							<p> waiting for a valid login...</p>
						</div>
					</div> 
		);
	}


	const handleFriend = (s: string) => {
		setType(s);
	}
	
	const handleUserSrch = function (e: ChangeEvent<HTMLInputElement>){
		setUserSrch(e?.currentTarget?.value);
	}

	const createDivUser =  (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		dispatch(userActions.getByLogin(userSrch));
	}

	if (user && user?.item?.login){
		if (user?.item?.login != current_user.data.login)
			searchView = UserFinded();
	}
	else
		searchView = UserNotFinded();

	return (
		<div className='webchatDiv3'>

			<div className='webchatDiv3_1'>
				<div className='webchatDiv3_1_1'>
					<div>
						<button onClick={() => handleFriend('conversation')}> CONVERSATION</button>
					</div>
					<div>
						<button onClick={() => handleFriend('friends')}> FRIENDS</button>
					</div>
					<div>
						<button onClick={() => handleFriend('block')}> BLOCK</button>
					</div>

				</div>
				<div className='webchatDiv3_1_2'>
					<form onSubmit={createDivUser} > 
						<input  type="search" onChange={handleUserSrch} placeholder="search user"/>
					</form>
					{searchView}
				</div> 

			</div>

			<div className='webchatDiv3_2'>

				<div className='d-flex flex-row m-3'>
					<p> {type} 10 </p>
				</div>

				<div id="allUser">
					<UserView type={type}></UserView>
				</div>

				
			</div>

		</div> 
	);
};


export default User;