import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';

import {
	MDBBtn,
	MDBRow,
	MDBCol,
	MDBInput
  } from 'mdb-react-ui-kit';
import "./SignUp.css";

function SignUp() {
	useEffect(() => {
		document.title = "SignUp";  
	}, []);

  const [hFirstName, setFirstName] = useState({ value: "" });
  const [hLastName, setLastName] = useState({ value: "" });
  const [hEmail, setEmail] = useState({ value: "" });
  const [hPassword, setPassword] = useState({ value: "" });

	const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

 //   alert(JSON.stringify(data))
    axios.post(`http://localhost:3002/users/signup`, {
      firstName: hFirstName.value,
      lastName: hLastName.value,
      email: hEmail.value,
      password: hPassword.value,
    })
    .catch((err: any) => {
      console.log(err.response)
      alert(err.response.data.message);
    })
  }

  const handleChangeFirstName = function(event: ChangeEvent<HTMLInputElement>) {
    console.log(event.target.value);
    event.preventDefault();
    setFirstName({ value: event?.currentTarget?.value });
  }

  const handleChangeLastName = function(event: ChangeEvent<HTMLInputElement>) {
    console.log(event.target.value);
    setLastName({ value: event?.currentTarget?.value });
  }

  const handleChangeEmail = function(event: ChangeEvent<HTMLInputElement>) {
    console.log(event.target.value);
    setEmail({ value: event?.currentTarget?.value });
  }

  const handleChangePassword = function(event: ChangeEvent<HTMLInputElement>) {
    console.log(event.target.value);
    setPassword({ value: event?.currentTarget?.value });
  }

  return (
    <div className="p-5 row bd-highlight justify-content-center">
		  <div className="p-2 d-flex flex-column bd-highlight col-example col-md-6 align-items-center justify-content-center h-100">
    			<div className="d-flex flex-column align-items-center justify-content-center w-75 pb-5 mb-3">
  	  			<p className="register_btn mb-3">
             If you have an account you can
				    </p>
				    <div className="d-flex flex-column align-items-center">
				      <MDBBtn color='primary' href="/signin">Login</MDBBtn>
				  </div>
			  </div>
    	{/* intentando con https://mdbootstrap.com/docs/b5/react/forms/overview/ */}
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

            <div className='text-center'>
              <p className="register_btn mb-3">
                or sign up with
              </p>
              <MDBBtn className='mx-1' color='light'>
							{/* tuto -> https://david-gilbertson.medium.com/icons-as-react-components-de3e33cb8792
								icons-> https://icomoon.io/app/#/select*/}
							<svg width="22" height="22" viewBox="0 0 1024 1024">
								<path d="M210.8 335.2l-174.8 174.8v142l175.2 0.8 174.8 1.2 1.2 87.2 0.8 86.8h172v-316h-350l352-352h-176l-175.2 175.2z"></path>
								<path d="M636 246c0 47.2 1.2 86 2.8 86s41.2-38.4 88-84.8l85.2-85.2v176l-176 176 0.8 86 1.2 86 87.2 1.2 86.8 0.8v-174l176-176v-178h-352v86z"></path>
								<path d="M900 602l-86 86h174v-86c0-47.2-0.4-86-1.2-86-0.4 0-39.6 38.8-86.8 86z"></path>
							</svg>
						</MDBBtn>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;

