import React from 'react';
import {
	MDBRange
  } from 'mdb-react-ui-kit';
import "./Room.css";
/*import { useAppDispatch, useAppSelector } from '../../_helpers/hooks';
import { useNavigate} from 'react-router-dom';
import { useParams } from "react-router-dom";*/
import img_pen from '../../icon/pen.png'
import img_cross from '../../icon/cancel.png'
//import { render } from '@testing-library/react';



function viewData(){
	return (
		<>
		<h1 className='font-weight-bold'> PRIVATE</h1>
		<h3 className='text-primary'> POWER-UP</h3>
		<h5> Score: 9</h5>
		<h6 className='mt-4'>Room name</h6>
		<h2 > 42</h2>
		<a className='mt-5'>
			<button className="m-4 RoomButtonPlay bg-warning display-6"> PLAY</button>
		</a>
		</>
	);
}


function viewEdit(){
	// const dispatch = useAppDispatch();
	// const navigate = useNavigate();
	// const authentication = useAppSelector<any>(state => state.authentication);
	// const alert = useAppSelector<any>(state => state.alert);
	return (
		<div className='d-flex flex-column justify-content-center align-items-center'>
			<div>
				<h6 className='RoomH6'>Room Name</h6>
				<input className='RoomInput'/>
			</div>
			<div className='d-flex flex-row mt-3'>
						<input className='ms-2 me-1' type="radio" name='type'/>
						<label className='display-9'>Classic</label>
						<input className='ms-2 me-1' type="radio" name='type'/>
						<label className='display-9'>Power</label>
			</div>
			<div className='d-flex flex-row mt-2'>
				<input className='ms-2 me-1 w-50' type="radio" name='room'/>
					<label>Public</label>
					<input className='ms-2 me-1 w-50' type="radio" name='room'/>
					<label>Private</label>
			</div>
			<div>
				<h6 className='RoomH6 mt-3'>Enter password</h6>
				<input className='RoomInput'/>
			</div>
			<div>
				<h6 className='RoomH6'>Confirm password</h6>
				<input className='RoomInput'/>
			</div>
			<div className="register_btn mb-1">
				<p className="register_btn mb-0 mt-3">
          Score
				</p>
				<MDBRange
      		defaultValue={10}
					min='0'
      		max='10'
      		id='customRange'
					labelClass='text-left w-100'
					/>
      </div>
				<button className='RoomButtonSave bg-primary ' onClick={() => window.location.reload()}>
					Save
				</button>
		</div>
	);
}



type IProps = {
}
type IState = {
	view :boolean
}

class Room extends React.Component<IProps, IState>{
	constructor(props: IProps){
		super(props)
		this.state = {
			view :true,
		}
		document.title = "Room";
	};
	
  buttonHandler = () => {
		this.setState({view :!this.state.view});
  }
	
	
	render(){
		let swap_img = require('../../icon/pen.png');
		return(
			<div className="RoomDiv1 shadow">
				<div className='bg-white d-flex align-items-center flex-column p-3 h-100 w-25' >
					<button className ="RoomButtonPen" onClick={this.buttonHandler} >
						{ this.state.view ? swap_img = <img className ="RoomImgPen" src={img_pen}></img>
						: swap_img = <img className ="RoomImgPen" src={img_cross}></img> }
					</button>
					{ this.state.view ? viewData() : viewEdit() }
				</div>

			 	<div className='w-75 bc-blue d-flex justify-content-center align-items-center flex-column h-100'>
			 		<div className='RoomDiv2'>
			 			<h1> HOST </h1>
			 		</div>
			 		<h1 className='text-white'>VS</h1>
			 		<div className='RoomDiv2'>
			 			<h1> OUTSIDER </h1>
			 		</div>
			 	</div>
			 </div>
	
	);}
}

export default Room;