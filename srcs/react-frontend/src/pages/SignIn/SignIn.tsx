import react, { useEffect } from 'react';
import {
	MDBBtn
  } from 'mdb-react-ui-kit';
import "./SignIn.css";

function SignIn() {
	useEffect(() => {
		document.title = "SigIn";  
	}, []);
  return (
	<div className="p-5 row bd-highlight justify-content-center">
		<div className="p-2 d-flex flex-column bd-highlight col-example col-md-6 align-items-center justify-content-center h-100">

			<div className="d-flex flex-column align-items-center justify-content-center w-75 pb-5 mb-3">
				<p className="register_btn mb-3">
					If you don't have an account
				</p>
				<div className="d-flex flex-column align-items-center">
				<MDBBtn color='primary' href="#">Register here</MDBBtn>
				</div>
			</div>

		</div>
	</div>
  );
}

export default SignIn;
