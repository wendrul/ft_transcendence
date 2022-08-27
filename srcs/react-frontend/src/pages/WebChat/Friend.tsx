import React from 'react';
import FriendUser from './FriendUser';
import "./Friend.css";


interface IProps{
}

interface IState{
	type: string;
}

class Friend extends React.Component<IProps, IState>{
	constructor(props: IProps){
		super(props);
		this.state = {type: 'online'};
	}
	
	handleFriend = (s: string) => {{
		this.setState({type: s});
	}}


	render(){
	return (
		<div className='webchatDiv3'>

			<div className='webchatDiv3_1'>
				<div className='webchatDiv3_1_1'>
					<div>
						<button onClick={() => this.handleFriend('online')}> ONLINE</button>
					</div>
					<div>
						<button onClick={() => this.handleFriend('all')}> ALL</button>
					</div>
					<div>
						<button onClick={() => this.handleFriend('block')}> BLOCK</button>
					</div>

				</div>
				<div className='webchatDiv3_1_2'>
					<input className='mx-3' type="text" placeholder="search user"/>
				</div>
			</div>

			<div className='webchatDiv3_2'>

				<div className='d-flex flex-row m-3'>
					<p> {this.state.type} 10 </p>
				</div>

				<div id="allUser">
					<FriendUser type={this.state.type}></FriendUser>
				</div>

				
			</div>

		</div> 
	);
};
}

export default Friend;