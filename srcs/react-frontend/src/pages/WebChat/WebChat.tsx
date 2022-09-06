import React from 'react';
import "./WebChat.css";
import User from './User';
import Channel from './Channel';


interface IProps {
}

interface IState {
  page?: string;
}

class WebChat extends React.Component<IProps, IState>{
	constructor(props: IProps){
		super(props);
		this.state = {page: 'User'};
	}
	handleUser = () => {{
			this.setState({page : 'User'});
	}};

	handleChannel = () => {{
			this.setState({page : 'channel'});
	}};

	render(){


		return(
	<div className='webchatDiv1'>
		<div className='webchatDiv2'>

			<div className='webchatDiv2_1'>
				<p> My Profile</p>
			</div>

			<div className='webchatDiv2_2'>
			<div className='mt-5'>
					<button onClick={this.handleUser}> USERS </button>
				</div>
				<div className='mt-5'>
				<button onClick={this.handleChannel}> CHANNEL</button>
				</div>			
			</div>

		</div>
		{this.state.page == 'User' ? <User></User> : <Channel></Channel>}

	</div>


	);
}}
export default WebChat;