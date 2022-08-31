import React, { useState, useEffect, ChangeEvent } from 'react';

import {
	MDBBtn,
	MDBInput
  } from 'mdb-react-ui-kit';
import "./Username.css";
import { useAppDispatch, useAppSelector } from '../../_helpers/hooks';
import { alertActions, userActions } from '../../_actions';
import { useNavigate } from 'react-router-dom';
import AlertPage from '../../components/Alerts/Alert';

function Username() {
	const dispatch = useAppDispatch();
  const navigate = useNavigate();
	const authentication = useAppSelector<any>(state => state.authentication);
  const userData = useAppSelector<any>(state => state.user);
	const alert = useAppSelector<any>(state => state.alert);

  const [user, setUser] = useState({});

	useEffect(() => {
		document.title = "Username";
		if (!userData.updated && !userData.updating && !authentication.initial && 
      ((!authentication.loggedIn && !authentication.loggingIn) 
      || (authentication.loggedIn && userData.data?.login)))
			navigate("/");
	}, [authentication, userData])

  useEffect(() => {
		if(user && Object.keys(user).length === 0)
      setUser(userData.data);
	}, [authentication])

  useEffect(() => {
    dispatch(alertActions.clear());
	}, [])

	const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
    dispatch(userActions.updateProfile(user));
	}

  const handleChangeUsername = function(event: ChangeEvent<HTMLInputElement>) {
    setUser({...user, login: event?.currentTarget?.value});
	}

  return (
    <>
      { authentication.loggedIn && 
        <div className="p-5 bd-highlight justify-content-center d-flex">
          <div className="p-2 d-flex flex-column bd-highlight col-example col-md-6 align-items-center justify-content-center h-100 w-100">
            <div className="d-flex flex-column align-items-center justify-content-center w-75 pb-5 mb-2">
              <p className="register_btn mb-3">
                  create your username
              </p>
              <form onSubmit={onSubmit}>
                <MDBInput className='mb-4' onChange={handleChangeUsername} type='text' id='form3Example3' required />
                <MDBBtn type='submit' className='mb-4' block>
                  Create
                </MDBBtn>
              </form>
              { alert && <AlertPage type={alert.type} text={alert.message} /> }
            </div>
          </div>
        </div>
      }
    </>
  );
}

export default Username;