import React, { useEffect, useState } from 'react';

// Image
import { useAppSelector } from '../../_helpers/hooks';
import { useNavigate } from 'react-router-dom';
import { MDBBadge, MDBBtn, MDBTable, MDBTableBody, MDBTableHead } from 'mdb-react-ui-kit';
import axios from 'axios';
import config from '../../config';

/*
	<img
	src={ avatarPath }
	alt=''
	style={{ width: '45px', height: '45px' }}
	className='rounded-circle'
	/>
*/

function Leaderboard(){ 
	const authentication = useAppSelector<any>(state => state.authentication);
	const navigate = useNavigate();
	//const alert = useAppSelector<any>(state => state.alert);

	useEffect(() => {
		document.title = "Leaderboard";
	}, [])

	interface Data {
		login: string;
		wins: number;
		loses: number;
		score: number;
	}

	const [ladder, setladder] = useState<Data[]>([]);
	
	useEffect(() => {
	if(!authentication.loggedIn && !authentication.loggingIn && !authentication.initial)
		navigate("/");
	}, [authentication, navigate])

	//Geting rank position
	useEffect(() => {
		axios.get(`${config.apiUrl}/users/ladder`)
			.then((res: any) => {
				const ladder = res.data;
				setladder(ladder);
			})
			.catch(() => {})
	}, []);

	return (
	<>
	{ authentication.loggedIn &&
		<>
		<div className="p-5 bd-highlight justify-content-center d-flex">
        	
        		<div className="d-flex flex-column align-items-center justify-content-center w-75">
              		<p className="register_btn">
						The 10 best players
            		</p>
            	
			</div>
		</div>
		<div className="bd-highlight justify-content-center d-flex">
			<div className="bd-highlight justify-content-center d-flex">
			<MDBTable align='middle'>
				<MDBTableHead>
					<tr>
					<th scope='col'>#</th>
					<th scope='col'>Login</th>
					<th scope='col'>Wins</th>
					<th scope='col'>Losses</th>
					<th scope='col'>Score</th>
					<th scope='col'>View Profile</th>
					</tr>
				</MDBTableHead>
				<MDBTableBody>
				{ ladder && ladder.map((item: Data, i:number) =>
					<tr key={item.login}>
						<td> {i + 1} </td>
						<td>
							<div className='d-flex align-items-center'>
							<div className='ms-3'>
								<p className='fw-bold mb-1'>{item.login}</p>
							</div>
							</div>
						</td>
						<td>
							<MDBBadge color='success' pill>
							{item.wins}
							</MDBBadge>
						</td>
						<td>
							<MDBBadge color='danger' pill>
							{item.loses} 
							</MDBBadge>
						</td>
						<td>{item.score}</td>
						<td>
							<MDBBtn color='link' rounded size='sm' href={"/profile/" + item.login}>
							View
							</MDBBtn>
						</td>
					</tr>
				)}
				</MDBTableBody>
			</MDBTable>
			</div>
		</div>
		</>
	}
	</>
	);
}

export default Leaderboard;
