import { useEffect, useState } from 'react';

import "./HomePage.css";
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useAppSelector } from '../../_helpers/hooks';
import img_user from '../../icon/utilisateur.png'
import img_gear from '../../icon/gear.png'
import axios from 'axios';

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

function UserView(user:any){
	let avatarPath = undefined;
	if(user?.data?.id) {
		avatarPath = "http://localhost:3002/localFiles/" + user.data.id;
	}
	return (
		<>
		<div className="d-flex flex-row mt-4">
			<div className="dboard-avatar shadow-lg rounded d-flex flex-column align-items-center m-4">
			{ avatarPath &&
						<img className='user' src={ avatarPath } alt='user'></img>}
				<h3 className='text-dark mt-4'> Ranking #1</h3>
				<h5 className='text-dark'> { user?.data?.login || "" } </h5>
			</div>
		</div>
		<button className='m-3 dboard-btn-sin bg-warning display-6'>PLAY !</button>
		<button className='m-3 dboard-btn-sup'>CREATE ROOM</button>
	</>
	);
}

function HomePage(){
	const authentication = useAppSelector<any>(state => state.authentication);
	const user = useAppSelector<any>(state => state.user);
	const navigate = useNavigate();
	const [params, setSearchParams] = useSearchParams();
	params.get("__firebase_request_key")

	const [url, seturl] = useState(params.get("twoFactor"));

	interface Data {
		login: string;
		wins: number;
		loses: number;
		score: number;
	}
	useEffect(() =>{
		if (params.get("twoFactor") === "true")
			console.log("url[",url,"]");
			if (url == "true")
			{
				navigate("/")
				seturl(params.get("code"));
				window.location.reload()
			}
	  }, [])
	
	useEffect(() => {
		document.title = "Home";
	/*	console.log();
		if (params.get("code"))
			console.log(params.get("code"))*/
	}, [])

	// const [ladder, setladder] = useState<Data[]>([
	// 	{ login: 'hola', wins: 2, losses: 3, score: 4},
	// 	{ login: 'ho', wins: 2, losses: 3, score: 4}
	// ]);

	const [ladder, setladder] = useState<Data[]>([
	]);

	useEffect(() => {
		axios.get("http://localhost:3002/users/ladder")
			.then((res: any) => {
				const ladder = res.data;
				setladder(ladder);
			})
			.catch(() => {})
	}, []);

	return(
		<div className='d-flex flex-row'>

			<div className='bc-gr2 d-flex flex-column align-items-center justify-content-center w-25'>
				{authentication.loggedIn ? UserView(user) : guestView()}
			</div>

			<div className='bc-blue d-flex flex-row align-items-center justify-content-center border-start border-2 border-dark w-75'>

				<div className='d-flex flex-row'>
					<div className='dboard-div-scroll border bg-white border rounded mb-5'>
						<div className='dboard-tab'>
							{ ladder && ladder.map((item: Data) =>  
							<div key={item.login} className='div-score bc-green'>
								<h3> Login: {item.login}  Wins: {item.wins} Losses: {item.loses} Score: {item.score}</h3>
							</div>						
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default HomePage;
