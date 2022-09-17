import React, { useState, useEffect, ChangeEvent } from 'react';
import {
	MDBBtn,
	MDBRow,
	MDBCol,
	MDBInput
  } from 'mdb-react-ui-kit';
import "./SignUp.css";
import { useAppDispatch, useAppSelector } from '../../_helpers/hooks';
import { useNavigate } from 'react-router-dom';
import { alertActions, userActions } from '../../_actions';
import AlertPage from '../../components/Alerts/Alert';
import config from '../../config';

function SignUp() {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const authentication = useAppSelector<any>(state => state.authentication);
	const alert = useAppSelector<any>(state => state.alert);

	useEffect(() => {
		document.title = "SignUp";
	
		if(authentication.loggedIn)
			navigate("/");
	}, [authentication, navigate])

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
    dispatch(alertActions.clear());
		dispatch(userActions.signup(firstName, lastName, email, password));
	}

  const handleChangeFirstName = function(event: ChangeEvent<HTMLInputElement>) {
    setFirstName(event?.currentTarget?.value);
  }

  const handleChangeLastName = function(event: ChangeEvent<HTMLInputElement>) {
    setLastName(event?.currentTarget?.value);
  }

  const handleChangeEmail = function(event: ChangeEvent<HTMLInputElement>) {
		setEmail(event?.currentTarget?.value);
	}
	
	const handleChangePassword = function(event: ChangeEvent<HTMLInputElement>) {
		setPassword(event?.currentTarget?.value);
	}

  return (
    <>
      { !authentication.loggedIn && 
        <div className="p-5 bd-highlight justify-content-center d-flex">
          <div className="p-2 d-flex flex-column bd-highlight col-example col-md-6 align-items-center justify-content-center h-100 w-100">
            <div className="d-flex flex-column align-items-center justify-content-center w-75 pb-5 mb-3">
               <p className="register_btn mb-3">
                If you have an account you can
              </p>
              <div className="d-flex flex-column align-items-center">
                <MDBBtn color='primary' href="/signin">Login</MDBBtn>
              </div>
            </div>
            <div className="d-flex flex-column align-items-center justify-content-center w-75 pb-5 mb-3">
              <form onSubmit={onSubmit}>
                <MDBRow className='mb-4'>
                  <MDBCol>
                    <MDBInput id='form3Example1' onChange={handleChangeFirstName} label='First name' required />
                  </MDBCol>
                  <MDBCol>
                     <MDBInput id='form3Example2' onChange={handleChangeLastName} label='Last name' required />
                  </MDBCol>
                </MDBRow>
                <MDBInput className='mb-4' onChange={handleChangeEmail} type='email' id='form3Example3' label='Email address' required />
                <MDBInput className='mb-4' onChange={handleChangePassword} type='password' id='form3Example4' label='Password' required />
                <MDBBtn type='submit' className='mb-4' block>
                  Sign Up
                </MDBBtn>
                {
                  alert && alert.message && alert.message?.map((value: any, key: number) => {
                      return <AlertPage key={key} type={alert.type} text={value} />
                    })
                }
              </form>
              <div className='text-center'>
                <p className="register_btn mb-3">
                  or sign up with
                </p>
								<a href={`${config.apiUrl}/users/auth42`} className="btn mx-1 light">
									<svg width="22" height="22" viewBox="0 0 1024 1024">
										<path d="M210.8 335.2l-174.8 174.8v142l175.2 0.8 174.8 1.2 1.2 87.2 0.8 86.8h172v-316h-350l352-352h-176l-175.2 175.2z"></path>
										<path d="M636 246c0 47.2 1.2 86 2.8 86s41.2-38.4 88-84.8l85.2-85.2v176l-176 176 0.8 86 1.2 86 87.2 1.2 86.8 0.8v-174l176-176v-178h-352v86z"></path>
										<path d="M900 602l-86 86h174v-86c0-47.2-0.4-86-1.2-86-0.4 0-39.6 38.8-86.8 86z"></path>
									</svg>
								</a>
              </div>
            </div>
          </div>
        </div>
      }
    </>
  );
}

export default SignUp;