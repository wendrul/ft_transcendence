import React from 'react'
import './ChatRoom.css'



interface IProps{
	chanName : string;
}

interface IState{
	// chanName : string;
}


function Channel (props:IProps){
	return(
		<div className='chatRoomDiv1_1'>

			<div>
				<p> Public </p>
				<p> {props.chanName}</p>
				<p> 3/12</p>
			</div>

			<p className='mb-0 text-start'>Connected</p>
			<div className='chatRoomCo'>
				<p>user</p>
				<p>user</p>
				<p>user</p>
				<p>user</p>
				<p>user</p>
				<p>user</p>
			</div>

			<p className='mt-3 mb-0 text-start'>Disconnected</p>
			<div className='chatRoomDeco'>
				<p>user</p>
				<p>user</p>
				<p>user</p>
				<p>user</p>
				<p>user</p>
				<p>user</p>
				<p>user</p>
				<p>user</p>
			</div>

		</div>
	);
}


class ChatRoom extends React.Component<IState, IProps>{
	constructor(props: IProps){
		super(props);
		this.state = {chanName: 'room Eric'};
	}


	render(){
	return(
		<div className='chatRoomDiv1'>

			<Channel chanName={this.state.chanName}></Channel>

			<div className='chatRoomDisplay'>
							<div className='chatRoomDisplayMsg'>
								<div className='chatRoomDisplayMsgUser'>
									<p className='d-flex justify-content-left'>CreepyUser:</p>
									<p className='d-flex justify-content-left'> Hi</p>
									<p className='d-flex justify-content-left'> Are you there ?</p>
									<p className='d-flex justify-content-left'> ???</p>
									<p className='d-flex justify-content-left'> Answer me please..</p>
									<p className='d-flex justify-content-left'> I know where you living !!!</p>
									<p className='d-flex justify-content-left'> I'm sorry...</p>
									<p className='d-flex justify-content-left'> I love you.</p>
									<p className='d-flex justify-content-left'> I don't want to scare you.</p>
									<p className='d-flex justify-content-left'> ANSWER ME !!!!!!!!</p>
									<p className='d-flex justify-content-left'> ANSWER ME !!!!!!!!</p>
									<p className='d-flex justify-content-left'> ANSWER ME !!!!!!!!</p>
									<p className='d-flex justify-content-left'> ANSWER ME !!!!!!!!</p>
									<p className='d-flex justify-content-left'> ANSWER ME !!!!!!!!</p>
									<p className='d-flex justify-content-left'> ANSWER ME !!!!!!!!</p>
									<p className='d-flex justify-content-left'> ANSWER ME !!!!!!!!</p>
									<p className='d-flex justify-content-left'> ANSWER ME !!!!!!!!</p>
									<p className='d-flex justify-content-left'> ANSWER ME !!!!!!!!</p>
									<p className='d-flex justify-content-left'> ANSWER ME !!!!!!!!</p>
								</div>
							</div>
							<div className='chatRoomDisplayMsgBar'>
								<input className='chatRoomDisplayMsgBarInput' type="text" placeholder="Send message..."/>
							</div>
						</div>


		</div>	
		
		
	);
	}
}

export default ChatRoom