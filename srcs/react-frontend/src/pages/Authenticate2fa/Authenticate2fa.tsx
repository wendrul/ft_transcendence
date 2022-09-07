import React, { useState, useEffect, ChangeEvent } from 'react';

import {
	MDBBtn,
	MDBInput
  } from 'mdb-react-ui-kit';
import { useAppDispatch, useAppSelector } from '../../_helpers/hooks';
import { alertActions, userActions } from '../../_actions';
import { useNavigate } from 'react-router-dom';
import AlertPage from '../../components/Alerts/Alert';

function Authenticate2fa() {
	const dispatch = useAppDispatch();
  const alert = useAppSelector<any>(state => state.alert);
  const navigate = useNavigate();
	const authentication = useAppSelector<any>(state => state.authentication);
  const user = useAppSelector<any>(state => state.user);

/*
	useEffect(() => {
		document.title = "authenticate 2fa";
		if (!userData.updated && !userData.updating && !authentication.initial && 
      ((!authentication.loggedIn && !authentication.loggingIn) 
      || (authentication.loggedIn && userData.data?.login)))
			navigate("/");
	}, [authentication, userData])

  useEffect(() => {
		if(user && Object.keys(user).length === 0)
      setUser(userData.data);
	}, [authentication])
*/
  useEffect(() => {
    dispatch(alertActions.clear());
	}, [])

const [code, setCode] = useState("");

	const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
    console.log("Codigo:[", code ,"]")
    dispatch(userActions.authenticate2fa(code));
	}

  const handleChangeCode = function(event: ChangeEvent<HTMLInputElement>) {
    setCode(event?.currentTarget?.value);
	}

  return (
    <>
      { authentication.loggedIn && 
        <div className="p-5 bd-highlight justify-content-center d-flex">
          <div className="p-2 d-flex flex-column bd-highlight col-example col-md-6 align-items-center justify-content-center h-100 w-100">
            <div className="d-flex flex-column align-items-center justify-content-center w-75 pb-5 mb-2">
              <p className="register_btn mb-3">
                  Enter your authentification code.
              </p>
              <form onSubmit={onSubmit}>
                <MDBInput className='mb-4' onChange={handleChangeCode} type='text' id='form3Example3' required />
                <MDBBtn type='submit' className='mb-4' block>
                  Summit
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

export default Authenticate2fa;