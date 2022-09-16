import React, { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import GameComponent from '../../GameComponent';



function PlayPremade(){ 

	const { id } = useParams();
	const [params, setSearchParams] = useSearchParams();
	params.get("__firebase_request_key")

	const [winCondition, setWinCondition] = useState(params.get("winCondition"));
	const [type, setType] = useState(params.get("type"));
	const [spectator, setSpectador] = useState(params.get("spectator"));

	return (
		<>
		{ 1 &&
			<>
				<GameComponent premade={true} spectator={spectator} roomID={id} type={type} winCondition={winCondition}/>
			</>
		}
		</>
	);
}

export default PlayPremade;
