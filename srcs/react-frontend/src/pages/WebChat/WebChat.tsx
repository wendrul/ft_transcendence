import React from 'react';
import "./WebChat.css";
import Friend from './Friend';
import Channel from './Channel';


interface IProps {
}

interface IState {
  page?: string;
}

class WebChat extends React.Component<IProps, IState>{
	constructor(props: IProps){
		super(props);
		this.state = {page: 'friend'};
	}
	handleFriend = () => {{
			this.setState({page : 'friend'});
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
					<button onClick={this.handleFriend}> FRIENDS</button>
				</div>
				<div className='mt-5'>
				<button onClick={this.handleChannel}> CHANNEL</button>
				</div>			
			</div>

		</div>
		{this.state.page == 'friend' ? <Friend></Friend> : <Channel></Channel>}

	</div>


	);
}}
export default WebChat;