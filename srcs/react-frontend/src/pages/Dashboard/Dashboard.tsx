import React from 'react'
import './Dashboard.css'
import { useAppSelector } from '../../_helpers/hooks';
import img_user from '../../icon/utilisateur.png'
import img_gear from '../../icon/gear.png'


function guestView(){
	return (
		<>
			<div className="d-flex flex-row mt-4">
				<div className="dboard-avatar shadow-lg rounded d-flex flex-column align-items-center m-4">
					<img className='user' src={img_user} alt='user'></img>
					<h3 className='text-dark mt-4'> GUEST</h3>				
				</div>
			</div>
			<button className='m-3 dboard-btn-sin bg-warning'> SIGN IN</button>
			<button className='m-3 dboard-btn-sup'> SIGN UP</button>
		</>
	);
}

function userView(){

	return (<h1>user view</h1>);
}

function Dashboard(){
	const authentication = useAppSelector<any>(state => state.authentication);

	return(
		<div className='d-flex flex-row'>

			<div className='bc-gr2 d-flex flex-column align-items-center justify-content-center w-25'>
				{authentication.user ? userView() : guestView()}
			</div>

			<div className='bc-blue d-flex flex-row align-items-center justify-content-center border-start border-2 border-dark w-75'>

				<div className='dboard-div-scroll border  bg-white border rounded mb-5'>
					<div className='d-flex flex-column mt-3 ms-4 m-4 mb-4'>

						<div className='d-flex flex-row align-items-center justify-content-between'>
							<div className="input-group w-50 mb-3">
						  	<span className="input-group-text bc-gr text-white" id="basic-addon1">Search</span>
	  						<input type="text" className="form-control " placeholder="pseudo" aria-label="pseudo" aria-describedby="basic-addon1"/>
							</div>
							
							<button className='bg-white border border-white' data-bs-toggle="tooltip" data-bs-placement="right" title="Filter">
								<img className="img_gear"src={img_gear} alt='gear'></img>
							</button>
						</div>


						<div className='div-score bc-red'>
							<h3> LOSE 10 - 3 PSEUDO #2 25/12/2002 14:43 </h3>
						</div>
						<div className='div-score bc-green'>
							<h3> WIN 10 - 3 PSEUDO #2 25/12/2002 14:43 </h3>
						</div>
						<div className='div-score bc-green'>
							<h3> WIN 10 - 3 PSEUDO #2 25/12/2002 14:43 </h3>
						</div>						<div className='div-score bc-green'>
							<h3> WIN 10 - 3 PSEUDO #2 25/12/2002 14:43 </h3>
						</div>						<div className='div-score bc-green'>
							<h3> WIN 10 - 3 PSEUDO #2 25/12/2002 14:43 </h3>
						</div>						<div className='div-score bc-green'>
							<h3> WIN 10 - 3 PSEUDO #2 25/12/2002 14:43 </h3>
						</div>						<div className='div-score bc-green'>
							<h3> WIN 10 - 3 PSEUDO #2 25/12/2002 14:43 </h3>
						</div>
						<div className='div-score bc-green'>
							<h3> WIN 10 - 3 PSEUDO #2 25/12/2002 14:43 </h3>
						</div>
						<div className='div-score bc-red'>
							<h3> LOSE 10 - 3 PSEUDO #2 25/12/2002 14:43 </h3>
						</div>
						<div className='div-score bc-red'>
							<h3> LOSE 10 - 3 PSEUDO #2 25/12/2002 14:43 </h3>
						</div>
						<div className='div-score bc-green'>
							<h3> WIN 10 - 3 PSEUDO #2 25/12/2002 14:43 </h3>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;