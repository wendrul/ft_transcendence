import React, { useEffect, useState } from 'react';
import "./Profile.css";

// Image
import img_pingpong from '../../icon/ping-pong.png'
import img_stats from '../../icon/statistiques.png'
import img_check from '../../icon/check.png'
import img_cancel from '../../icon/cancel.png'

import img_medal_color from '../../icon/medal_color.png'
import img_medal_black from '../../icon/medal_black.png'
import { useAppDispatch, useAppSelector } from '../../_helpers/hooks';
import { useNavigate } from 'react-router-dom';
import { alertActions, userActions } from '../../_actions';
import { MDBIcon } from 'mdb-react-ui-kit';
import axios from 'axios';
import config from '../../config';
import AlertPage from '../../components/Alerts/Alert';

function Profile(){ 
	const dispatch = useAppDispatch();
	const authentication = useAppSelector<any>(state => state.authentication);
	const user = useAppSelector<any>(state => state.user);
	const navigate = useNavigate();
	const users = useAppSelector<any>(state => state.users);
	const alert = useAppSelector<any>(state => state.alert);


	
	useEffect(() => {
	if(!authentication.loggedIn && !authentication.loggingIn && !authentication.initial)
		navigate("/");
	}, [authentication])

	useEffect(() => {
			dispatch(alertActions.clear())
		}, [dispatch])

	//Geting avatar
	let avatarPath = undefined;
	if(user?.data?.id) { avatarPath = `${config.apiUrl}/localFiles/${user.data.id}`; }

	//Geting rank position
   const [rank, setrank] = useState("");
   if (user && user?.data && user?.data?.login)
		axios.get(`${config.apiUrl}/users/rankPositionByLogin/${user?.data?.login}`,
		{
			withCredentials: true,
		}
	).then((Response: any) => {
		const rank: string = Response.data
		setrank(rank);
	});

	//Geting performance
	let performance = 0;
	if (user?.data?.wins !== 0 || user?.data?.loses !== 0)
			performance = Math.floor((user?.data?.wins / (user?.data?.wins + user?.data?.loses)) * 100);

	return (
	<>
	{ authentication.loggedIn &&
		<>
		{ alert && <AlertPage type={alert.type} text={alert.message} /> }
		<div className="bd d-flex flex-column align-items-center justify-content-center pb-5 mt-5">
			<p className="register_btn mb-1 display-2">
				Ranking {rank}
			</p>
			<p className="register_btn mb-3 display-6">
				{ user && user.data && user.data.login? user.data.login : "default" }
			</p>
			<div className='row-btn1 mt-3'>
				<button id='btn-profile'>
					PROFILE
				</button>
				<a href={window.location.origin + '/history'}>
					<button id='btn-history'>
						HISTORY
					</button>
				</a>
			</div>
			<div className="h-px d-flex flex-row mt-4">

				<div className="shadow-lg bd-gr bc-gr rounded d-flex flex-column 
				align-items-center m-4">
					<div className='d-flex justify-content-end'>
					<form action="/edit_profile" className='d-flex justify-content-end'>
						<button className="row-but2 border border-dark d-flex flex-row ">
							<MDBIcon className="row-img2" fas icon="user-edit" size='lg'/>
						</button>
					</form>
					</div>
					{avatarPath &&
					<img className='user'  src={ avatarPath } alt='user'></img>}
					<p>    {(authentication.loggedIn) ? "Online" : "Offline"}    </p>
				</div>

				<div className='d-flex flex-column align-items-center justify-content-center'>

					<div className="d-flex flex-row align-items-center justify-content-center m-3">
						<img className="img1"src={img_pingpong} alt='ping-pong'></img>
						<div className='d-flex flex-column'>
							<div className='d-flex flex-row align-items-center justify-content-center'>
								<h5 className='m-0 text-dark stats-txt'> MATCH</h5>
							</div>
							<div className='stats'>
								<h5>{user?.data?.wins + user?.data?.loses}</h5>
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
								<h5>{ performance } %</h5>
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
								<h5 className='text-success'>{user?.data?.wins}</h5>
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
								<h5 className='text-danger'>{user?.data?.loses}</h5>
							</div>
						</div>
					</div>

				</div>	
			</div>
			<div className="d-flex flex-column mt-5">
				<div className='d-flex flex-row'>
					<div className={`achievement ${( user?.data?.wins > 9 ? "bc-blue" : "bc-gr")} `}>
						<div className='d-flex align-items-center justify-content-center'>
							<img className ='img2' src={img_medal_color} alt='color medal'></img>
						</div>
						<div className='achievement-txt'>
							<h6> 10 VICTORIES</h6>
							<p> Spartans, eat well, for tonight we dine in Hades !</p>
						</div>
					</div>
					<div className={`achievement ${( performance > 80 ? "bc-blue" : "bc-gr")} `}>
						<div className='d-flex align-items-center justify-content-center'>
							<img className ='img2' src={img_medal_black} alt='black medal'></img>
						</div>
						<div className='achievement-txt'>
							<h6> + 80% PERFORMANCE</h6>
							<p> YOU ARE A CHAMPION</p>
						</div>
					</div>
					<div className={`achievement ${( user?.data?.loses > 9 ? "bc-blue" : "bc-gr")} `}>
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
