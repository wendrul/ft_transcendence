import React from 'react'
import './History.css';

function History (){
	return(
		<div className="bc-gr2 bd d-flex flex-column align-items-center justify-content-center pb-5 mt-5">
			<p className="register_btn mb-1 display-2">
				Ranking #1
			</p>
			<p className="register_btn mb-3 display-6">
				PSEUDO
			</p>
			<div className='row-btn1 mt-3'>
				<a href={window.location.origin + '/profile'}>
					<button id='btn-profile2'>
						PROFILE
					</button>
				</a>
					<button id='btn-history2'>
						HISTORY
					</button>
			</div>

			<div className='div-scroll border  bg-white border rounded'>
				<div className='d-flex flex-column m-3'>
					<div className='div-score bc-red'>
						<h3> LOSE 10 - 3 PSEUDO #2 25/12/2002 14:43 </h3>
					</div>
					<div className='div-score bc-green'>
						<h3> WIN 10 - 3 PSEUDO #2 25/12/2002 14:43 </h3>
					</div>
					<div className='div-score bc-green'>
						<h3> WIN 10 - 3 PSEUDO #2 25/12/2002 14:43 </h3>
					</div>
					<div className='div-score bc-red'>
						<h3> LOSE 10 - 3 PSEUDO #2 25/12/2002 14:43 </h3>
					</div>
					<div className='div-score bc-red'>
						<h3> LOSE 10 - 3 PSEUDO #2 25/12/2002 14:43 </h3>
					</div>
					<div className='div-score bc-green'>
						<h3> WIN 10 - 3 PSEUDO #2 25/12/2002 14:43 </h3>
					</div>
				</div>
			</div>
			
		</div>
		);
}

export default History;