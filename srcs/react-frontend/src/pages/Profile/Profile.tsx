import React from 'react';
import { MDBBtn, MDBBtnGroup } from 'mdb-react-ui-kit';
import "./Profile.css";


function Profile(){
	return (
		<div className="bd d-flex flex-column align-items-center justify-content-center pb-5 mt-5">
				<p className="register_btn mb-1 display-2">
					Ranking #1
				</p>
				<p className="register_btn mb-3 display-6">
					PSEUDO
				</p>
			<MDBBtnGroup aria-label='Basic example'
			className="p-1 bc-bl">
			<MDBBtn href='#' active>
				PROFILE
			</MDBBtn>
			<MDBBtn href='#' className="btn-history">
				HISTORY
			</MDBBtn>
	</MDBBtnGroup>

		<div className="h-px border border-danger d-flex flex-row">
			<div className="bc-gr border border-danger d-flex flex-column 
			align-items-center justify-content-center m-5">
				<h1> IMAGE</h1>
			</div>
			<div className="border border-danger d-flex flex-column align-items-center justify-content-center m-5">
				<h1>COL2</h1>
			</div>
			<div className="border border-danger d-flex flex-column align-items-center justify-content-center m-5">
				<h1>COL3</h1>
			</div>	
		</div>			


	</div>
	);
}

export default Profile;