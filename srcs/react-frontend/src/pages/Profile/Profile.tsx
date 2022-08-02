import React, { useEffect } from 'react';
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
import { useNavigate } from 'react-router-dom';
import { userActions } from '../../_actions';
import { MDBIcon } from 'mdb-react-ui-kit';

function Profile(){ 
	const dispatch = useAppDispatch();
	const authentication = useAppSelector<any>(state => state.authentication);
	const user = useAppSelector<any>(state => state.user);
	const navigate = useNavigate();
	const users = useAppSelector<any>(state => state.users);

	useEffect(() => {

	if(!authentication.loggedIn && !authentication.loggingIn && !authentication.initial)
		navigate("/");
	}, [authentication])

	return (
		<div className="bc-gr2 bd d-flex flex-column align-items-center justify-content-center pb-5 ">
			<p className="register_btn mt-5 mb-1 display-2">
				Ranking #1
			</p>
			<p className="register_btn mb-3 display-6">
				{ user.data && user.data.login? user.data.login : "default" }
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

			{/* Different view */}

			{/* <div className="bg-white shadow-lg rounded d-flex flex-column 
			align-items-center m-4">
				<div className='d-flex justify-content-end'>
				<form action="/edit_profile" className='d-flex justify-content-end'>
					<button className="row-but2 border border-dark d-flex flex-row ">
						<MDBIcon className="row-img2" fas icon="user-edit" size='lg'/>
					</button>
				</form>
				</div>
				<img className='user' src={img_user} alt='user'></img>
				<p>AVAILABLE</p>
				<div className="d-flex flex-row m-3 mb-1">
					<button className="row-but2 border border-dark d-flex flex-row ">
					<img className="row-img2"src={img_friends} alt='friends'></img>
					</button>
					<button className="row-but2 border border-dark d-flex flex-row ">
					<img className="row-img2"src={img_chat} alt='chat'></img>
					</button>
					<button className="row-but2 border border-dark d-flex flex-row ">
					<img className="row-img2"src={img_swords} alt='swords'></img>
					</button>
					<button className="row-but2 border border-dark d-flex flex-row ">
					<img className="row-img2"src={img_prohibition} alt='prohibition'></img>
					</button>
				</div>

			</div> */}

			<div className='d-flex flex-column align-items-center justify-content-center'>

				<div className="d-flex flex-row align-items-center justify-content-center m-3">
					<img className="img1"src={img_pingpong} alt='ping-pong'></img>
					<div className='d-flex flex-column'>
						<div className='d-flex flex-row align-items-center justify-content-center'>
							<h5 className='m-0 text-dark stats-txt'> MATCH</h5>
						</div>
						<div className='stats'>
							<h5>324</h5>
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
							<h5>86 %</h5>
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
							<h5 className='text-success'>280</h5>
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
							<h5 className='text-danger'>44</h5>
						</div>
					</div>
				</div>

			</div>	
		</div>





		<div className="d-flex flex-column mt-5">
			<div className='d-flex flex-row'>
				<div className='achievement bc-blue'>
					<div className='d-flex align-items-center justify-content-center'>
						<img className ='img2' src={img_medal_color} alt='color medal'></img>
					</div>
					<div className='achievement-txt'>
						<h6> 300 VICTORIES</h6>
						<p> Spartans, eat well, for tonight we dine in Hades !</p>
					</div>
				</div>
				<div className='achievement bg-white'>
					<div className='d-flex align-items-center justify-content-center'>
						<img className ='img2' src={img_medal_black} alt='black medal'></img>
					</div>
					<div className='achievement-txt'>
						<h6> 10 FRIENDS</h6>
						<p> You've got a friend in me</p>
					</div>
				</div>
			
				<div className='achievement bg-white'>
					<div className='d-flex align-items-center justify-content-center'>
							<img className ='img2' src={img_medal_black} alt='black medal'></img>
						</div>
						<div className='achievement-txt'>
							<h6> 10 MESSAGES</h6>
							<p> Don't Drink And Drive, But When You Do, Call Saul.</p>
						</div>
					</div>
				</div>
			</div>

			<div className='d-flex flex-row'>
			<div className='achievement bg-white'>
					<div className='d-flex align-items-center justify-content-center'>
						<img className ='img2' src={img_medal_black} alt='black medal'></img>
					</div>
					<div className='achievement-txt'>
						<h6>126 LOSES</h6>
						<p>OH MY GOD! THEY KILLED KENNY! YOU B*******!</p>
					</div>
				</div>

				<div className='achievement bg-white'>
					<div className='d-flex align-items-center justify-content-center'>
						<img className ='img2' src={img_medal_black} alt='black medal'></img>
					</div>
					<div className='achievement-txt'>
						<h6> 10 BANS</h6>
						<p> I could simply snap my fingers and they would all cease to exist.</p>
					</div>
				</div>

				<div className='achievement bg-white'>
					<div className='d-flex align-items-center'>
						<img className ='img2' src={img_medal_black} alt='black medal'></img>
					</div>
					<div className='achievement-txt'>
						<h6> ?</h6>
						<p> Où est Charlie ? Where's Wally?</p>
					</div>
				</div>
			</div>

			<div className='d-flex flex-row'>
			<div className='achievement bg-white'>
					<div className='d-flex align-items-center justify-content-center'>
						<img className ='img2' src={img_medal_black} alt='black medal'></img>
					</div>
					<div className='achievement-txt'>
						<h6> BE #1 ONE MONTH</h6>
						<p> Not a Queen. A Khaleesi.</p>
					</div>
				</div>

				<div className='achievement bg-white'>
					<div className='d-flex align-items-center justify-content-center'>
						<img className ='img2' src={img_medal_black} alt='black medal'></img>
					</div>
					<div className='achievement-txt'>
						<h6> 1 PERFECT MATCH</h6>
						<p>Why am I so different from them ?</p>
					</div>
				</div>

				<div className='achievement bg-white'>
					<div className='d-flex align-items-center justify-content-center'>
						<img className ='img2' src={img_medal_black} alt='black medal'></img>
					</div>
					<div className='achievement-txt'>
						<h6>BE OFFLINE</h6>
						<p>I'm hiding, I can see you ...</p>
					</div>
				</div>
			</div>

		</div>
			


		
	);
}

export default Profile;
