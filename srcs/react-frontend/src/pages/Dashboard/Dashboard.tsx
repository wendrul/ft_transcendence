import React from 'react'
import './Dashboard.css'
import { useAppSelector } from '../../_helpers/hooks';
import img_user from '../../icon/utilisateur.png'


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
			<div className='bc-blue d-flex flex-row align-items-center justify-content-center border border-2 border-dark w-75'>
					<h1>TAB</h1>
			</div>
		</div>
	);
};

export default Dashboard;