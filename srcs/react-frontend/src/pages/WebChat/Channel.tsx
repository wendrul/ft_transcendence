import React, { useState} from 'react';
import Popup from 'reactjs-popup';
import "./Channel.css";
import { useAppDispatch, useAppSelector } from '../../_helpers/hooks';
import {channelActions} from '../../_actions/channel.actions'
import {UpdateUser} from "../../interfaces/iUser";


interface IProps{
}

interface IState{
	type: string;
}

function OneChannel(){
	return(
		<div className='d-flex flex-row border-bottom m-3 justify-content-between'>
		<div className='d-flex flex-row '>
			<p> Channel name</p>
		</div>
		<div>
		<button onClick={() => window.open(window.location.origin + '/chat_room')}>Chat</button>
		<button className='bg-danger'>Delete</button>
		</div>
	</div>
	);
}


// function ViewPublic(){
// 	return(
// 		<>
// 		<div className='d-flex flex-row m-3'>
// 			<div>
// 				<p> Public channel</p>
// 			</div>
// 			<div className='mx-2'>

// 				<Popup trigger={<button className="button"> + </button>} modal>
// 					<div className='channelPopup'>
// 						<form onSubmit={onSubmit} className='d-flex flex-column align-items-center justify-content-center'>

// 							<div>
// 								<input type="text" name="type" placeholder='Channel name'/>
// 							</div>

// 							<input type="submit" value="Submit"/>
// 						</form>
// 					</div>
// 				</Popup>
// 			</div>
// 	</div> 
	
// 	<div id="allChannel">
// 		{OneChannel()}
// 		{OneChannel()}
// 		{OneChannel()}
// 		{OneChannel()}
// 		{OneChannel()}
// 		{OneChannel()}
// 		{OneChannel()}
// 		{OneChannel()}

// 	</div>
// 	</>
// 	);
// }

function ViewProtect(){
	return(
		<>
		<div className='d-flex flex-row m-3'>
			<div>
				<p> Protect channel</p>
			</div>
			<div className='mx-2'>

		<Popup trigger={<button className="button"> + </button>} modal>
			<div className='channelPopup'>
				<form className='d-flex flex-column align-items-center justify-content-center'>

					<div>
						<input type="text" name="type" placeholder='Channel name'/>
					</div>
					<div>
						<input type="password" name="type" placeholder='Password'/>
					</div>
					<div>
						<input type="password" name="type" placeholder='Confirm password'/>
					</div>

					<input type="submit" value="Envoyer" />
				</form>
			</div>
		</Popup>

			</div>
	</div> 
	
	<div id="allChannel">
		{OneChannel()}
		{OneChannel()}
		{OneChannel()}
		{OneChannel()}
		{OneChannel()}
		{OneChannel()}
		{OneChannel()}
		{OneChannel()}

	</div>
	</>
	);
}

const dispatch = useAppDispatch();
class Channel extends React.Component<IProps, IState>{
	constructor(props: IProps){
		super(props);
		this.state = {type: 'public'};
	}
	handleChannel = (s: string) => {{
		this.setState({type: s});
	}}

	onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		let fruits: string[] = ['Apple', 'Orange', 'Banana'];
		let person: UpdateUser = {};

		alert('hello');
		// event.preventDefault();
		dispatch(channelActions.createChannel(
			fruits,
			'public',
			' ',
			'roomEriling',
			person
		));
	}

	ViewPublic = () => {
		return(
			<>
			<div className='d-flex flex-row m-3'>
				<div>
					<p> Public channel</p>
				</div>
				<div className='mx-2'>
	
					<Popup trigger={<button className="button"> + </button>} modal>
						<div className='channelPopup'>
							<form onSubmit={this.onSubmit} className='d-flex flex-column align-items-center justify-content-center'>
	
								<div>
									<input type="text" name="type" placeholder='Channel name'/>
								</div>
			
								<input type="submit" value="Submit"/>
							</form>
						</div>
					</Popup>
				</div>
		</div> 
		
		<div id="allChannel">
			{OneChannel()}
			{OneChannel()}
			{OneChannel()}
			{OneChannel()}
			{OneChannel()}
			{OneChannel()}
			{OneChannel()}
			{OneChannel()}
	
		</div>
		</>
		);
	}

	render(){
	return (
		<div className='webchatDiv3'>

			<div className='webchatDiv3_1'>
				<div className='webchatDiv3_1_1'>
					<div>
						<button onClick={() => this.handleChannel('public')}> PUBLIC</button>
					</div>
					<div>
						<button onClick={() => this.handleChannel('protected')}> PROTECTED</button>
					</div>

				</div>
				<div className='webchatDiv3_1_2'>
					<input className='mx-3' type="text" placeholder="search channel"/>
				</div>
			</div>

			<div className='webchatDiv3_2'>
				{this.state.type == 'public' ? this.ViewPublic() : ViewProtect()}
			</div>

		</div> 
	)};
}

export default Channel;