import React, { useEffect, useState, ChangeEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
	MDBBtn,
	MDBInput
  } from 'mdb-react-ui-kit';
import "./SignIn.css";


function SignIn() {
	let navigate = useNavigate();
	useEffect(() => {
		document.title = "SigIn";
	}, []);

/*	axios.get(`http://localhost:3002/users`)
	.then(res => {
	  const persons = res.data;
		console.log(res.data.email);
	})
*/

	const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
	
		axios.post(`http://localhost:3002/users/signin`, {
		  email: hEmail.value,
		  password: hPassword.value,
		}, { withCredentials: true })
		.then((res: any) => {
		//	console.log(res)
			navigate('/');
		})
		.catch((err: any) => {
		  console.log(err.response)
		})
	}

	const [hEmail, setEmail] = useState({ value: "" });
	const [hPassword, setPassword] = useState({ value: "" });
  

	const handleChangeEmail = function(event: ChangeEvent<HTMLInputElement>) {
		setEmail({ value: event?.currentTarget?.value });
	}
	
	const handleChangePassword = function(event: ChangeEvent<HTMLInputElement>) {
	setPassword({ value: event?.currentTarget?.value });
	}

  return (
	<div className="p-5 row bd-highlight justify-content-center">
		<div className="p-2 d-flex flex-column bd-highlight col-example col-md-6 align-items-center justify-content-center h-100">

			<div className="d-flex flex-column align-items-center justify-content-center w-75 pb-5 mb-3">
				<p className="register_btn mb-3">
					If you don't have an account 
				</p>
				<div className="d-flex flex-column align-items-center">
					<MDBBtn color='primary' href="/signup">Register here</MDBBtn>
				</div>
			</div>

	{/* intentando con https://mdbootstrap.com/docs/b5/react/forms/overview/ */}
			<div className="d-flex flex-column align-items-center justify-content-center w-75 pb-5 mb-3">
				<form onSubmit={onSubmit}>
					
					<MDBInput className='mb-4' onChange={handleChangeEmail} type='email' id='form1Example1' required label='Email address'  />
					<MDBInput className='mb-4' onChange={handleChangePassword} type='password' id='form1Example2' required label='Password' />

					{/*<MDBRow className='mb-4'>
						<MDBCol>
							<a href='#!'>Forgot password?</a>
						</MDBCol>
  					</MDBRow> */}
					<MDBBtn type='submit' className='mb-4' block>
						Sign in
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

export default SignIn;
