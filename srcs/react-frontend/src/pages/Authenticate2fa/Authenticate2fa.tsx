import React, { useState, useEffect, ChangeEvent } from 'react';

import {
	MDBBtn,
	MDBInput
  } from 'mdb-react-ui-kit';
import { useAppDispatch, useAppSelector } from '../../_helpers/hooks';
import { alertActions, userActions } from '../../_actions';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AlertPage from '../../components/Alerts/Alert';

function Authenticate2fa() {
	const dispatch = useAppDispatch();
  const alert = useAppSelector<any>(state => state.alert);
  const navigate = useNavigate();
	const authentication = useAppSelector<any>(state => state.authentication);
  const userData = useAppSelector<any>(state => state.user);

  const [params, setSearchParams] = useSearchParams();
	params.get("__firebase_request_key")

  const [twofactor, setTwo] = useState(false);

  useEffect(() =>{
    if (params.get("twoFactor"))
      setTwo(true)
  }, [params])

  useEffect(() => {
    dispatch(alertActions.clear());
	}, [dispatch])

  useEffect(() => {
    if (userData && userData.bool2fa)
    {

      if (twofactor)
      {
        const url = "/?" + params;
        navigate(url)
      }
      else
        navigate("/")
    }
	}, [userData, navigate, twofactor, params])

const [code, setCode] = useState("");

	const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
    dispatch(userActions.authenticate2fa(code));
	}

  const handleChangeCode = function(event: ChangeEvent<HTMLInputElement>) {
    setCode(event?.currentTarget?.value);
	}

  return (
    <>
      { (authentication.loggedIn || twofactor) && 
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