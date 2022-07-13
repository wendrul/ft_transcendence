import React from 'react';
import { MDBBtn, MDBBtnGroup } from 'mdb-react-ui-kit';
import "./Profile.css";

// Image
import img_user from '../../icon/utilisateur.png'
import img_friends from '../../icon/friends.png'
import img_chat from '../../icon/chat.png'
import img_swords from '../../icon/swords.png'
import img_prohibition from '../../icon/prohibition.png'

function Profile(){
	return (
		<div className="bd d-flex flex-column align-items-center justify-content-center pb-5 mt-5">
				<p className="register_btn mb-1 display-2">
					Ranking #1
				</p>
				<p className="register_btn mb-3 display-6">
					PSEUDO
				</p>
			<MDBBtnGroup aria-label='Basic example'
			className="p-1 bc-bl">
			<MDBBtn href='#' active>
				PROFILE
			</MDBBtn>
			<MDBBtn href='#' className="btn-history">
				HISTORY
			</MDBBtn>
	</MDBBtnGroup>

		<div className="h-px border border-danger d-flex flex-row">
			<div className="shadow-lg bd-gr bc-gr rounded d-flex flex-column 
			align-items-center m-5">
				<img className='user' src={img_user}></img>
				<p>AVAILABLE</p>
				<div className="d-flex flex-row m-3">
					<button className="row-but border border border-dark d-flex flex-row ">
					<img className="row-img"src={img_friends}></img>
					</button>
					<button className="row-but border border border-dark d-flex flex-row ">
					<img className="row-img"src={img_chat}></img>
					</button>
					<button className="row-but border border border-dark d-flex flex-row ">
					<img className="row-img"src={img_swords}></img>
					</button>
					<button className="row-but border border border-dark d-flex flex-row ">
					<img className="row-img"src={img_prohibition}></img>
					</button>
				</div>
			</div>

			<div className='d-flex flex-column align-items-center justify-content-center'>

				<div className="border border-danger d-flex flex-row align-items-center justify-content-center m-3">
					<div className='border border border-dark d-flex flex-column'>
					<h3> IMG</h3>
					</div>
					<div className='d-flex flex-column'>
						<div className='d-flex flex-row align-items-center justify-content-center'>
							<h5 className='m-0 text-dark stats-txt'> MATCH</h5>
						</div>
						<div className='stats'>
							<h5>324</h5>
						</div>
					</div>
				</div>

				<div className="border border-danger d-flex flex-row align-items-center justify-content-center m-3">
					<div className='border border border-dark d-flex flex-column'>
					<h3> IMG</h3>
					</div>
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

				<div className="border border-danger d-flex flex-row align-items-center justify-content-center m-3">
					<div className='border border border-dark d-flex flex-column'>
					<h3> IMG</h3>
					</div>
					<div className='d-flex flex-column'>
						<div className='d-flex flex-row align-items-center justify-content-center'>
							<h5 className='m-0 text-dark stats-txt'> WIN</h5>
						</div>
						<div className='stats'>
							<h5 className='text-success'>280</h5>
						</div>
					</div>
				</div>

				<div className="border border-danger d-flex flex-row align-items-center justify-content-center m-3">
					<div className='border border border-dark d-flex flex-column'>
					<h3> IMG</h3>
					</div>
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

		<div className="h-px border border-danger d-flex flex-row">

		</div>
			


	</div>
	);
}

export default Profile;
