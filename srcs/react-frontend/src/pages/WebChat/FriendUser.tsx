import React from 'react'


const oneBlockUser = () => {{
	return(
		<div className='d-flex flex-row border-bottom m-3 justify-content-between'>
		<div className='d-flex flex-row '>
			<p> blocked user</p>
		</div>
		<div>
		<button className='bg-primary'>Unlock</button>
		</div>
	</div>
	);
}}

const oneUser = (s: string) => {{
	return(
		<div className='d-flex flex-row border-bottom m-3 justify-content-between'>
		<div className='d-flex flex-row '>
			<p> {s} user</p>
		</div>
		<div>
		<button> Play</button>
		<button onClick={() => window.open(window.location.origin + '/chat_room')}>Chat</button>
		<button className='bg-danger'>Delete</button>
		</div>
	</div>
	);
}}

interface IProps{
	type: string;
}

interface IState{
}

class FriendUser extends React.Component<IProps, IState>{
	constructor(props: IProps){
		super(props);
	}

	render(): React.ReactNode {
		let view;
		if (this.props.type == 'online' || this.props.type == 'all'){
			view = oneUser(this.props.type);
		}
		else if (this.props.type == 'block'){
			view = oneBlockUser();
		}

		return(
			<>
				{view}
				{view}
				{view}
				{view}
				{view}
				{view}
				{view}
				{view}
			</>
		);
	}
}

export default FriendUser