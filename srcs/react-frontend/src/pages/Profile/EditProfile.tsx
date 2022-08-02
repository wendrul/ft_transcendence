import React, { useState, useEffect, ChangeEvent } from 'react';
import {
	MDBBtn,
	MDBRow,
	MDBCol,
	MDBInput
  } from 'mdb-react-ui-kit';
import { useAppDispatch, useAppSelector } from '../../_helpers/hooks';
import { useNavigate } from 'react-router-dom';
import { userActions } from '../../_actions';

function EditProfile() {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const authentication = useAppSelector<any>(state => state.authentication);
  const userData = useAppSelector<any>(state => state.user);
	const alert = useAppSelector<any>(state => state.alert);


  const [user, setUser] = useState({});

	useEffect(() => {
		document.title = "Edit Profile";
		if(!authentication.loggedIn)
			navigate("/");
	}, [authentication])

  useEffect(() => {
		if(user && Object.keys(user).length === 0)
      setUser(userData.data);
	}, [authentication])

	const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
	//	dispatch(userActions.updateProfile(firstName, lastName, login));
  dispatch(userActions.updateProfile(user));
  //  navigate("/profile");
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
                    <MDBInput id='form3Example1' onChange={handleChangeFirstName} defaultValue={userData.data.firstName} label='First name'/>
                  </MDBCol>
                  <MDBCol>
                     <MDBInput id='form3Example2' onChange={handleChangeLastName} defaultValue={userData.data.lastName} label='Last name'/>
                  </MDBCol>
                </MDBRow>
                <MDBInput className='mb-4' onChange={handleChangeLogin} type='text' id='form3Example4' defaultValue={userData.data.login} label='login'/>
                <MDBBtn type='submit' className='mb-4' block>
                  Save
                </MDBBtn>
              </form>
            </div>
          </div>
        </div>
      }
    </>
  );
}

export default EditProfile;