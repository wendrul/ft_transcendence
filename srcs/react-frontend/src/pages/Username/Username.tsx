import React, { useState, useEffect, ChangeEvent } from 'react';

import {
	MDBBtn,
	MDBInput
  } from 'mdb-react-ui-kit';
import "./Username.css";
import { useAppDispatch, useAppSelector } from '../../_helpers/hooks';
import { useNavigate } from 'react-router-dom';
import { userActions } from '../../_actions';

function Username() {
	const dispatch = useAppDispatch();
	const authentication = useAppSelector<any>(state => state.authentication);
	const alert = useAppSelector<any>(state => state.alert);

	useEffect(() => {
		document.title = "Username";
	
	//	if(authentication.loggedIn)
		//	navigate("/");
	}, [])

  const [username, setUsername] = useState("");

	const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
	//	dispatch(userActions.updateUsername(setUsername));
	}

  const handleChangeUsername = function(event: ChangeEvent<HTMLInputElement>) {
		setUsername(event?.currentTarget?.value);
	}

  return (
    <>
      { /*!authentication.loggedIn*/ 1 && 
        <div className="p-5 row bd-highlight justify-content-center">
          <div className="p-2 d-flex flex-column bd-highlight col-example col-md-6 align-items-center justify-content-center h-100">
            <div className="d-flex flex-column align-items-center justify-content-center w-75 pb-5 mb-2">
              <p className="register_btn mb-3">
                  create your username
              </p>
              <form onSubmit={onSubmit}>
                <MDBInput className='mb-4' onChange={handleChangeUsername} type='email' id='form3Example3' required />
                <MDBBtn type='submit' className='mb-4' block>
                  Create
                </MDBBtn>
              </form>
            </div>
          </div>
        </div>
      }
    </>
  );
}

export default Username;