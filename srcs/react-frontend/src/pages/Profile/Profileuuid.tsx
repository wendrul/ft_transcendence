import React, { useEffect, useState } from 'react';
import "./Profile.css";

// Image
import img_user from '../../icon/utilisateur.png'
import img_friends from '../../icon/friends.png'
import img_chat from '../../icon/chat.png'
import img_swords from '../../icon/swords.png'
import img_prohibition from '../../icon/prohibition.png'

import img_pingpong from '../../icon/ping-pong.png'
import img_stats from '../../icon/statistiques.png'
import img_check from '../../icon/check.png'
import img_cancel from '../../icon/cancel.png'

import img_medal_color from '../../icon/medal_color.png'
import img_medal_black from '../../icon/medal_black.png'
import { useAppDispatch, useAppSelector } from '../../_helpers/hooks';
import { useNavigate, useParams } from 'react-router-dom';
import { alertActions, userActions } from '../../_actions';
import axios from 'axios';
import config from '../../config';
import {MDBIcon} from 'mdb-react-ui-kit';
import AlertPage from '../../components/Alerts/Alert';

function blockButton() {
	return (
		<MDBIcon className="row-img2" fas icon="ban" size="lg"/>
	)
}

function unblockButton() {
	return (
		<MDBIcon className="row-img2" fas icon="check-square" size="lg"/>
	)
}

function Profile(){ 
	const dispatch = useAppDispatch();
	const authentication = useAppSelector<any>(state => state.authentication);
	const user = useAppSelector<any>(state => state.user);
	const users = useAppSelector<any>(state => state.users);
	const alert = useAppSelector<any>(state => state.alert);
	const navigate = useNavigate();

	const { uuid } = useParams();



	useEffect(() => {
		if(!authentication.loggedIn && !authentication.loggingIn && !authentication.initial)
			navigate("/");
		}, [authentication])
	
	useEffect(() => {
		if (uuid === user?.data?.login)
			navigate("/profile")
		else
			dispatch(userActions.getByLoginNavbar(""+ uuid));
	}, [navigate, dispatch])

	useEffect(() => {
		if(!users.encontrado && !users.buscando && users.itemNavbar === null)
			navigate("/404");
	}, [users])

	let avatarPath = undefined;
	if(users?.itemNavbar?.id) { avatarPath = `${config.apiUrl}/localFiles/${users?.itemNavbar?.id}`; }

	//Geting rank position
    const [rank, setrank] = useState("");
	useEffect(() => {
		if (users && users?.itemNavbar && users?.itemNavbar?.login) {
			axios.get(`${config.apiUrl}/users/rankPositionByLogin/${users?.itemNavbar?.login}`,
				{
					withCredentials: true,
				}
			).then((Response: any) => {
				const rank: string = Response.data
				setrank(rank);
			}).catch(() => {});
		}
	}, [users]);

	//Set performnace
	let perform: number = 0;
	if (users?.itemNavbar?.wins !== 0 || users?.itemNavbar?.loses !== 0)
		perform = Math.floor((users?.itemNavbar?.wins / (users?.itemNavbar?.wins + users?.itemNavbar?.loses)) * 100);

	//check if user is blocked
	const [blockedFlag, setBlockedFlag] = useState<boolean>(false);
	useEffect(() => {
		if (users?.itemNavbar?.login) {
			axios.get(`${config.apiUrl}/users/isUserBlocked/${users?.itemNavbar?.login}`,
				{
					withCredentials: true,
				}
			).then((Response: any) => {
				const blockFlag: boolean = Response.data
				setBlockedFlag(blockFlag);
			}).catch(() => {});
		}
	}, [users]);

	function changeBlockStatus() {
		if (blockedFlag){
			axios.get(`${config.apiUrl}/users/unblock/${users?.itemNavbar?.login}`,
				{
					withCredentials: true,
				}
			).then(() => window.location.reload()).catch(() => {})
		} else {
			axios.get(`${config.apiUrl}/users/block/${users?.itemNavbar?.login}`,
				{
					withCredentials: true,
				}
			).then(() => window.location.reload()).catch(() => {})
		}
	}

	function sendFriendRequest() {
		axios.post(`${config.apiUrl}/friendRequest/create`,
			{
				login: users.itemNavbar.login,
			},
			{
				withCredentials: true,
			}
		).then(() => {}).catch(() => {})
	}

	return (
		<>
		{ authentication.loggedIn && users.loaded && users.itemNavbar && uuid !== user?.data?.login &&
			<>
				{ alert && <AlertPage type={alert.type} text={alert.message} /> }
				<div className="bd d-flex flex-column align-items-center justify-content-center pb-5 mt-5">
					<p className="register_btn mb-1 display-2">
						Ranking {rank}
					</p>
					<p className="register_btn mb-3 display-6">
						{ users.itemNavbar && users.itemNavbar.login? users.itemNavbar.login : "default" }
					</p>
					<div className='row-btn1 mt-3'>
						<button id='btn-profile'>
							PROFILE
						</button>
						<a href={window.location.origin + '/history/' + users.itemNavbar.login}>
							<button id='btn-history'>
								HISTORY
							</button>
						</a>
					</div>
			
					<div className="h-px d-flex flex-row mt-4">

						<div className="shadow-lg bd-gr bc-gr rounded d-flex flex-column 
						align-items-center m-4">
							{ avatarPath &&
							<img className='user' src={ avatarPath } alt='user'></img>}
							<p> { users?.itemNavbar?.login } </p>
							<div className="d-flex flex-row m-3 mb-1">
								<button onClick={(e) => {
									sendFriendRequest();
									}} className="row-but2 border border-dark d-flex flex-row ">
									<MDBIcon className="row-img2" fas icon="hippo" size="lg"/>
								</button>
								{/* <button className="row-but2 border border-dark d-flex flex-row "> */}
								{/* <img className="row-img2"src={img_chat} alt='chat'></img> */}
								{/* </button> */}
								{/* <button className="row-but2 border border-dark d-flex flex-row "> */}
								{/* <img className="row-img2"src={img_swords} alt='swords'></img> */}
								{/* </button> */}
								<button onClick={(e) => {
									changeBlockStatus();
									}} className="row-but2 border border-dark d-flex flex-row ">
									<>
										{(blockedFlag) ? unblockButton() : blockButton()}
									</>
								</button>
							</div>
						</div>

						<div className='d-flex flex-column align-items-center justify-content-center'>

							<div className="d-flex flex-row align-items-center justify-content-center m-3">
								<img className="img1"src={img_pingpong} alt='ping-pong'></img>
								<div className='d-flex flex-column'>
									<div className='d-flex flex-row align-items-center justify-content-center'>
										<h5 className='m-0 text-dark stats-txt'> MATCH</h5>
									</div>
									<div className='stats'>
										<h5>{users?.itemNavbar?.wins + users?.itemNavbar?.loses}</h5>
									</div>
								</div>
							</div>

							<div className="d-flex flex-row align-items-center justify-content-center m-3">
								<img className="img1"src={img_stats} alt='stats'></img>
								<div className='d-flex flex-column'>
									<div className='d-flex flex-row align-items-center justify-content-center'>
										<h5 className='m-0 text-dark stats-txt'> PERFORMANCE</h5>
									</div>
									<div className='stats'>
										<h5>{perform} %</h5>
									</div>
								</div>
							</div>
						</div>		

						<div className='d-flex flex-column align-items-center justify-content-center'>

							<div className="d-flex flex-row align-items-center justify-content-center m-3">
								<img className="img1"src={img_check} alt='check'></img>
								<div className='d-flex flex-column'>
									<div className='d-flex flex-row align-items-center justify-content-center'>
										<h5 className='m-0 text-dark stats-txt'> WIN</h5>
									</div>
									<div className='stats'>
										<h5 className='text-success'>{users?.itemNavbar?.wins}</h5>
									</div>
								</div>
							</div>

							<div className="d-flex flex-row align-items-center justify-content-center m-3">
								<img className="img1"src={img_cancel} alt='cancel'></img>
								<div className='d-flex flex-column'>
									<div className='d-flex flex-row align-items-center justify-content-center'>
										<h5 className='m-0 text-dark stats-txt'> LOSE</h5>
									</div>
									<div className='stats'>
										<h5 className='text-danger'>{users?.itemNavbar?.loses}</h5>
									</div>
								</div>
							</div>
						</div>	
					</div>
					<div className="d-flex flex-column mt-5">
						<div className='d-flex flex-row'>
							<div className={`achievement ${( users?.itemNavbar?.wins > 9 ? "bc-blue" : "bc-gr")} `}>
								<div className='d-flex align-items-center justify-content-center'>
									<img className ='img2' src={img_medal_color} alt='color medal'></img>
								</div>
								<div className='achievement-txt'>
									<h6> 10 VICTORIES</h6>
									<p> Spartans, eat well, for tonight we dine in Hades !</p>
								</div>
							</div>
							<div className={`achievement ${( perform > 80 ? "bc-blue" : "bc-gr")} `}>
								<div className='d-flex align-items-center justify-content-center'>
									<img className ='img2' src={img_medal_black} alt='black medal'></img>
								</div>
								<div className='achievement-txt'>
									<h6> + 80% PERFORMANCE</h6>
									<p> YOU ARE A CHAMPION</p>
								</div>
							</div>
							<div className={`achievement ${( users?.itemNavbar?.loses > 9 ? "bc-blue" : "bc-gr")} `}>
								<div className='d-flex align-items-center justify-content-center'>
										<img className ='img2' src={img_medal_black} alt='black medal'></img>
								</div>
								<div className='achievement-txt'>
									<h6>10 LOSES</h6>
										<p>OH MY GOD! THEY KILLED KENNY! YOU B*******!</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</>
		}
		</>
	);
}

export default Profile;
