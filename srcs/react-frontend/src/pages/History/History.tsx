import axios from 'axios';
import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom';
import config from '../../config';
import {useAppSelector} from '../../_helpers/hooks';
import './History.css';

function winInterface(item: any) {
	return (
		<div key={item.id} className='div-score bc-green'>
			<h3> {item.result} {item.winerScore} - {item.losserScore} vs {item.rival} </h3>
		</div>
	)
}

function defeatInterface(item: any) {
	return (
		<div key={item.id} className='div-score bc-red'>
			<h3> {item.result} {item.losserScore} - {item.winerScore} vs {item.rival} </h3>
		</div>
	)
}


function History (){
	const authentication = useAppSelector<any>(state => state.authentication);
	const user = useAppSelector<any>(state => state.user);
	const navigate = useNavigate();

	useEffect(() => {
		if(!authentication.loggedIn && !authentication.loggingIn && !authentication.initial)
			navigate("/");
	}, [authentication])

	//Geting rank position
	const [rank, setrank] = useState("");
	if (user && user?.data && user?.data?.login)
		axios.get(`${config.apiUrl}/users/rankPositionByLogin/` + user?.data?.login,
			{
				withCredentials: true,
			}
		).then((Response: any) => {
			const rank: string = Response.data
			setrank(rank);
		});

	interface Data {
		id: number;
		winerScore: number;
		losserScore: number;
		winerLogin: string;
		losserLogin: string;
	}

	interface RealData {
		id: number;
		result: string;
		winerScore: number;
		losserScore: number;
		rival: string;
		bc: string;
	}

	const [history, setHistory] = useState<Data[]>([]);

			useEffect(() => {
				if (user && user?.data && user?.data?.login)
					axios.get(`${config.apiUrl}/users/matchHistory/` + user.data.login,
						{
							withCredentials: true,
						})
						.then((res: any) => {
							const history = res.data;
							setHistory(history);
						})
						.catch(() => {})
			}, []);

	let results: RealData[] = [];
	for(let i = 0; i < history?.length; i++) {
		let result: RealData = {id: 0, result: '?', winerScore: 0, losserScore: 0, rival: '?', bc: 'white'};
		result.id = history[i].id;
		result.result = (history[i].winerLogin === user?.data?.login) ? 'WIN' : 'DEFEAT';
		result.winerScore = history[i].winerScore;
		result.losserScore = history[i].losserScore;
		result.rival = (history[i].winerLogin !== user?.data?.login) ? history[i].winerLogin : history[i].losserLogin; 
		result.bc = (result.result === 'WIN') ? 'green' : 'red';

		results.push(result);
	}

	return(
		<>
			{ authentication.loggedIn &&
			<>
				<div className="bc-gr2 bd d-flex flex-column align-items-center justify-content-center pb-5 mt-5">
					<p className="register_btn mb-1 display-2">
						Ranking {rank}
					</p>
					<p className="register_btn mb-3 display-6">
						{user.data.login}
					</p>
					<div className='row-btn1 mt-3'>
						<a href={window.location.origin + '/profile'}>
							<button id='btn-profile2'>
								PROFILE
							</button>
						</a>
						<button id='btn-history2'>
							HISTORY
						</button>
					</div>

					<div className='div-scroll bd  border bg-white border rounded'>
						<div className='d-flex flex-column m-3'>
							{ results && results.map((item: RealData) =>
								<div key={item.id}>
									{(item.result === 'WIN') ? winInterface(item) : defeatInterface(item)}
								</div>
							)}
						</div>
					</div>

				</div>
			</>
			}
		</>
	);
}

export default History;
