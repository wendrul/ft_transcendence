import React, { useState, useEffect } from 'react';
import "./CreateRoom.css";
import { useAppDispatch, useAppSelector } from '../../_helpers/hooks';
import { useNavigate } from 'react-router-dom';
import RoomCreate from './component/RoomCreate';

function CreateRoom() {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const authentication = useAppSelector<any>(state => state.authentication);
	const alert = useAppSelector<any>(state => state.alert);

	useEffect(() => {
		document.title = "CreateRoom";
	
	}, [])

  const [basicActive, setBasicActive] = useState('tab1');

  const handleBasicClick = (value: string) => {
    if (value === basicActive) {
      return;
    }
    setBasicActive(value);
  };

  return (
    <>
      { 1 &&
        <div className="p-5 bd-highlight justify-content-center d-flex">
          <div className="p-2 d-flex flex-column bd-highlight col-example col-md-6 align-items-center justify-content-center h-100 w-100">
           <p className="register_btn mb-3">Create a Room </p>
            <RoomCreate active={basicActive === 'tab1'} />
          </div>
        </div>
      }
    </>
  );
}

export default CreateRoom;