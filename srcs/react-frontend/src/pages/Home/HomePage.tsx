import { useEffect } from 'react';

import "./HomePage.css";
import { useSearchParams } from 'react-router-dom';
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
				<a href="/signin">
					<button  className='m-3 dboard-btn-sin bg-warning'> SIGN IN</button>
				</a>
				<a href="/signup">
					<button className='m-3 dboard-btn-sup'> SIGN UP</button>
				</a>
		</>
	);
}

function userView(){

	return (
		<>
		<div className="d-flex flex-row mt-4">
			<div className="dboard-avatar shadow-lg rounded d-flex flex-column align-items-center m-4">
				<img className='user' src={img_user} alt='user'></img>
				<h3 className='text-dark mt-4'> Ranking #1</h3>
				<h5 className='text-dark'> Pseudo</h5>
			</div>
		</div>
		<button className='m-3 dboard-btn-sin bg-warning display-6'>PLAY !</button>
		<button className='m-3 dboard-btn-sup'>CREATE ROOM</button>
	</>
	);
}

function HomePage(){
	const authentication = useAppSelector<any>(state => state.authentication);

	const [params, setSearchParams] = useSearchParams();
	params.get("__firebase_request_key")

	useEffect(() => {
		document.title = "Home";
		console.log(1)
		console.log(params.get("code"));
		console.log(2)
	}, [])

	return(
		<div className='d-flex flex-row'>

			<div className='bc-gr2 d-flex flex-column align-items-center justify-content-center w-25'>
				{authentication.loggedIn ? userView() : guestView()}
			</div>

			<div className='bc-blue d-flex flex-row align-items-center justify-content-center border-start border-2 border-dark w-75'>

				<div className='d-flex flex-row'>
					<div className='dboard-div-scroll border bg-white border rounded mb-5'>
						<form className='filter'>
							<div className='d-flex justify-content-center mt-5'>
								<input className='filter-search' type="text" placeholder="Search.."/>
							</div>
							<div>
								<h4 className='ms-3 mt-4 mb-0'>Rank</h4>
								<input className='ms-3 me-1' type="radio" name='rank'/>
								<label>highest rank</label>
							</div>
							<div>
								<input className='ms-3 me-1' type="radio" name='rank'/>
								<label>lowest rank</label>
							</div>
							<div>
							<h4 className='ms-3 mt-2 mb-0'>Score</h4>
							<input className='ms-3 me-1' type="radio" name='score'/>
								<label>highest score</label>
							</div>
							<div>
								<input className='ms-3 me-1' type="radio" name='score'/>
								<label>lowest score</label>
							</div>
						</form>
						<div className='dboard-tab'>

					<div className='div-score bc-green'>
						<h3> WIN 10 - 3 PSEUDO #2 25/12/2002 14:43 </h3>
					</div>
					<div className='div-score bc-green'>
						<h3> WIN 10 - 3 PSEUDO #2 25/12/2002 14:43 </h3>
					</div>
					<div className='div-score bc-green'>
						<h3> WIN 10 - 3 PSEUDO #2 25/12/2002 14:43 </h3>
					</div>
					<div className='div-score bc-green'>
						<h3> WIN 10 - 3 PSEUDO #2 25/12/2002 14:43 </h3>
					</div>										
					<div className='div-score bc-red'>
						<h3> LOSE 10 - 3 PSEUDO #2 25/12/2002 14:43 </h3>
					</div>
					<div className='div-score bc-green'>
						<h3> WIN 10 - 3 PSEUDO #2 25/12/2002 14:43 </h3>
					</div>
					<div className='div-score bc-green'>
						<h3> WIN 10 - 3 PSEUDO #2 25/12/2002 14:43 </h3>
					</div>
					<div className='div-score bc-red'>
						<h3> LOSE 10 - 3 PSEUDO #2 25/12/2002 14:43 </h3>
					</div>
					<div className='div-score bc-green'>
						<h3> WIN 10 - 3 PSEUDO #2 25/12/2002 14:43 </h3>
					</div>
					<div className='div-score bc-green'>
						<h3> WIN 10 - 3 PSEUDO #2 25/12/2002 14:43 </h3>
					</div>
					<div className='div-score bc-red'>
						<h3> LOSE 10 - 3 PSEUDO #2 25/12/2002 14:43 </h3>
					</div>						
					<div className='div-score bc-green'>
						<h3> WIN 10 - 3 PSEUDO #2 25/12/2002 14:43 </h3>
					</div>
					<div className='div-score bc-green'>
						<h3> WIN 10 - 3 PSEUDO #2 25/12/2002 14:43 </h3>
					</div>
					<div className='div-score bc-red'>
						<h3> LOSE 10 - 3 PSEUDO #2 25/12/2002 14:43 </h3>
					</div>						
							
						</div>


					</div>
		 		</div>



			</div>
		</div>
	);
};

export default HomePage;
