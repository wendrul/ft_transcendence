import axios from 'axios';
import React, {useEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom';
import config from '../../config';
import {userActions} from '../../_actions';
import {useAppDispatch, useAppSelector} from '../../_helpers/hooks';
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
	const dispatch = useAppDispatch();
	const authentication = useAppSelector<any>(state => state.authentication);
	const user = useAppSelector<any>(state => state.user);
	const navigate = useNavigate();
	const users = useAppSelector<any>(state => state.users);

	const { uuid } = useParams();

	useEffect(() => {
		if(!authentication.loggedIn && !authentication.loggingIn && !authentication.initial)
			navigate("/");
	}, [authentication])

	useEffect(() => {
		if (!users.initial && !users.loaded && !users.loading)
			navigate("/404");
	}, [users])

	useEffect(() => {
		dispatch(userActions.getById(uuid));
	}, [])

	//Geting rank position
	const [rank, setrank] = useState("");
	if (users && users?.item && users?.item?.login)
		axios.get(`${config.apiUrl}/users/rankPositionByLogin/` + users?.item?.login,
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

	// const [history, setHistory] = useState<Data[]>([
	// 	{ id:1, winerScore: 10, losserScore: 3, winer: 'tontin', losser: 'test'},
	// 	{ id:2, winerScore: 10, losserScore: 3, winer: 'test', losser: 'tontin'},
	// ]);

	const [history, setHistory] = useState<Data[]>([]);

	useEffect(() => {
		if (user && users?.item && users?.item?.login !== undefined) {
		axios.get(`${config.apiUrl}/users/matchHistory/` + users.item.login,
			{
				withCredentials: true,
			})
			.then((res: any) => {
				const history = res.data;
				setHistory(history);
			})
			.catch(() => {})
		}
	}, [users]);

	let results: RealData[] = [];
	for(let i = 0; i < history?.length; i++) {
		let result: RealData = {id: 0, result: '?', winerScore: 0, losserScore: 0, rival: '?', bc: 'white'};
		result.id = history[i].id;
		result.result = (history[i].winerLogin === users?.item?.login) ? 'WIN' : 'DEFEAT';
		result.winerScore = history[i].winerScore;
		result.losserScore = history[i].losserScore;
		result.rival = (history[i].winerLogin !== users?.item?.login) ? history[i].winerLogin : history[i].losserLogin; 
		result.bc = (result.result === 'WIN') ? 'green' : 'red';

		results.push(result);
	}

	return(
		<>
			{ authentication.loggedIn && users.loaded && users.item &&
			<>
				<div className="bc-gr2 bd d-flex flex-column align-items-center justify-content-center pb-5 mt-5">
					<p className="register_btn mb-1 display-2">
						Ranking {rank}
					</p>
					<p className="register_btn mb-3 display-6">
						{users.item.login}
					</p>
					<div className='row-btn1 mt-3'>
						<a href={window.location.origin + '/profile/' + users.item.login}>
							<button id='btn-profile2'>
								PROFILE
							</button>
						</a>
						<button id='btn-history2'>
							HISTORY
						</button>
					</div>

					<div className='div-scroll border  bg-white border rounded'>
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
