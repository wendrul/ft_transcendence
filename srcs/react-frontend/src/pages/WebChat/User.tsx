import React, { useState, ChangeEvent, useEffect} from 'react';
import UserView from './UserView';
import { useAppDispatch, useAppSelector } from '../../_helpers/hooks';
import "./User.css";
import { alertActions, friendActions, userActions } from '../../_actions';



// interface Iprop {
// 	search : boolean;
// }


function User(){
	const [type, setType] = useState("conversation");
	const [userSrch, setUserSrch] = useState('');
	const users = useAppSelector<any>(state => state.users);
	const current_user = useAppSelector<any>(state => state.user);
	// const friends = useAppSelector<any>(state => state.friend);
	const dispatch = useAppDispatch();
	let searchView;

	useEffect(() => {
		dispatch(friendActions.getFriends())
	},[])

	useEffect(() => {
		dispatch(alertActions.clear());
	}, [dispatch])

	const UserFinded = () => {
		return (
		<div className='FriendSearch'>
						<div>
							<p> user: {users?.item?.login}</p>
						</div>
						<div>
							{/* <button onClick={() => window.open(window.location.origin + '/direct_message/' + users?.item?.login)}> */} 
							<button onClick={() =>  window.location.href=window.location.origin + '/direct_message/' + users?.item?.login}>
								Chat
							</button>
							{/* <button onClick={() => window.open(window.location.origin + '/profile/' + users?.item?.login)}> */}
							<button onClick={() => window.location.href=(window.location.origin + '/profile/' + users?.item?.login)}>
								Profile 
							</button>
						</div>
			</div> 
		);
	}
	const UserNotFinded = () => {
		return (
			<div className='FriendSearch'>
						<div>
						</div>
					</div> 
		);
	}


	const handleFriend = (s: string) => {
		setType(s);
	}
	
	const handleUserSrch = function (e: ChangeEvent<HTMLInputElement>){
		setUserSrch(e?.currentTarget?.value);
		dispatch(alertActions.clear());
	}

	const createDivUser =  (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		dispatch(userActions.getByLogin(userSrch));
	}


	if (users && users?.loged){
		if (users?.item?.login !== current_user.data.login)
			searchView = UserFinded();
	}
	else
		searchView = UserNotFinded();

	return (
		<>
			<div className='webchatDiv3'>
				<div className='webchatDiv3_1'>
					<div className='webchatDiv3_1_1'>
						<div>
							<button onClick={() => handleFriend('conversation')}> CONVERSATION</button>
						</div>
						<div>
							<button onClick={() => handleFriend('friends')}> FRIENDS</button>
						</div>

					</div>
					<div className='webchatDiv3_1_2'>
						<form onSubmit={createDivUser} > 
							<input className="mx-3" type="search" onChange={handleUserSrch} placeholder="search user"/>
						</form>
						{searchView}
					</div> 

				</div>

				<div className='webchatDiv3_2'>

					<div className='d-flex flex-row m-3'>
						<p> {type}</p>
					</div>

					<div id="allUser">
						<UserView type={type}></UserView>
					</div>

					
				</div>

			</div> 
		</>
	);
};


export default User;
