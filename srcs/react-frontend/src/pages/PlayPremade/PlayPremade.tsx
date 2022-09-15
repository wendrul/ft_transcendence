import React, { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../_helpers/hooks';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { userActions } from '../../_actions';
import axios from 'axios';
import config from '../../config';
import {MDBIcon} from 'mdb-react-ui-kit';



function PlayPremade(){ 

	const { id } = useParams();
	const [params, setSearchParams] = useSearchParams();
	params.get("__firebase_request_key")

	const [matchid, setMatchid] = useState(params.get("name"));
	const [winCondition, setWinCondition] = useState(params.get("winCondition"));
	const [type, setType] = useState(params.get("type"));
	const [spectator, setSpectador] = useState(params.get("spectator"));

	return (
		<>
		{ 1 &&
			<>
				<div>{matchid}</div>
				<div>{winCondition}</div>
				<div>{type}</div>
				<div>{spectator? "1": "0"}</div>
			</>
		}
		</>
	);
}

export default PlayPremade;
