import React, { useState} from 'react';
import Popup from 'reactjs-popup';
import "./Channel.css";


interface IProps{
}

interface IState{
	type?: string;
}

function ViewPublic(){
	return(
		<div className='d-flex flex-row border-bottom m-3'>
		<div>
			<p> Public channel</p>
		</div>
		<div className='mx-2'>

		<Popup trigger={<button className="button"> + </button>} modal>
			<div className='channelPopup'>
				<form className='d-flex flex-column align-items-center justify-content-center'>

					<div>
						<input type="text" name="type" placeholder='Channel name'/>
					</div>

					<input type="submit" value="Envoyer" />
				</form>
			</div>
		</Popup>

		</div>
	</div> );
}

function ViewProtect(){
	return(
		<div className='d-flex flex-row border-bottom m-3'>
		<div>
			<p> Protected channel</p>
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
	</div> );
}

class Channel extends React.Component<IProps, IState>{
	constructor(props: IProps){
		super(props);
		this.state = {type: 'public'};
	}
	
	handleChannel = (s: string) => {{
		this.setState({type: s});
	}}


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
				{this.state.type == 'public' ? ViewPublic() : ViewProtect()}
			</div>

		</div> 
	)};
}

export default Channel;