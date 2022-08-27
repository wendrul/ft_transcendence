import React from 'react';

function Friend(){
	return (
		<div className='webchatDiv3'>

			<div className='webchatDiv3_1'>
				<div className='webchatDiv3_1_1'>
					<div>
						<button> ONLINE</button>
					</div>
					<div>
						<button> ALL</button>
					</div>
					<div>
						<button> BLOCKED</button>
					</div>

				</div>
				<div className='webchatDiv3_1_2'>
					<input className='mx-3' type="text" placeholder="search user"/>
				</div>
			</div>

			<div className='webchatDiv3_2'>

				<div className='d-flex flex-row border-bottom m-3'>
					<p> Online 3 </p>
				</div>

				{/* USER */}
				<div className='d-flex flex-row border-bottom m-3 justify-content-between'>
					<div className='d-flex flex-row '>
						<h5>AVATAR</h5>
						<p> username</p>
					</div>
					<div>
					<button>CHAT</button>
					</div>
				</div>


				
			</div>

		</div> 
	);
}

export default Friend;