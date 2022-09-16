import React, { useState, useEffect, ChangeEvent } from 'react';
import {
	MDBBtn,
	MDBRow,
	MDBCol,
	MDBInput
  } from 'mdb-react-ui-kit';
import { useAppDispatch, useAppSelector } from '../../../_helpers/hooks';
import { useNavigate } from 'react-router-dom';
import { alertActions, userActions } from '../../../_actions';
import AlertPage from '../../../components/Alerts/Alert';

function EditInfo() {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const authentication = useAppSelector<any>(state => state.authentication);
  const userData = useAppSelector<any>(state => state.user);
	const alert = useAppSelector<any>(state => state.alert);

  const [user, setUser] = useState({});

	useEffect(() => {
		document.title = "Edit Information";
		if(!authentication.loggedIn)
			navigate("/");
	}, [authentication])

  useEffect(() => {
		if(user && Object.keys(user).length === 0)
      setUser(userData.data);
	}, [authentication])

  useEffect(() => {
		if(userData && userData.updated)
     navigate("/")
	}, [userData])


	const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
    dispatch(alertActions.clear());
    dispatch(userActions.updateProfile(user));

	}

  const handleChangeFirstName = function(event: ChangeEvent<HTMLInputElement>) {
    setUser({...user, firstName: event?.currentTarget?.value});
  }

  const handleChangeLastName = function(event: ChangeEvent<HTMLInputElement>) {
    setUser({...user, lastName: event?.currentTarget?.value});
  }

  const handleChangeLogin = function(event: ChangeEvent<HTMLInputElement>) {
    setUser({...user, login: event?.currentTarget?.value});
	}

  return (
    <>
      { authentication.loggedIn && 
        <div className="p-5 bd-highlight justify-content-center d-flex">
          <div className="p-2 d-flex flex-column bd-highlight col-example col-md-6 align-items-center justify-content-center h-100 w-100">
            <div className="d-flex flex-column align-items-center justify-content-center w-75 pb-5 mb-3">
              <p className="register_btn mb-3">
               Edit your profile
              </p>
            </div>
            <div className="d-flex flex-column align-items-center justify-content-center w-75 pb-5 mb-3">
              <form onSubmit={onSubmit}>
                <MDBRow className='mb-4'>
                  <MDBCol>
                    <MDBInput onChange={handleChangeFirstName} defaultValue={userData.data.firstName} label='First name'/>
                  </MDBCol>
                  <MDBCol>
                     <MDBInput onChange={handleChangeLastName} defaultValue={userData.data.lastName} label='Last name'/>
                  </MDBCol>
                </MDBRow>
                <MDBInput className='mb-3' onChange={handleChangeLogin} type='text' defaultValue={userData.data.login} label='login'/>
                <br />
                <MDBBtn type='submit' className='mb-4' block>
                  Save
                </MDBBtn>
                {
                  alert && alert.message && alert.message?.map((value: any, key: number) => {
                      return <AlertPage key={key} type={alert.type} text={value} />
                    })
                }
              </form>
            </div>
          </div>
        </div>
      }
    </>
  );
}

export default EditInfo;