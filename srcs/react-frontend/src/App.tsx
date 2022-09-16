import React, {useEffect, useState} from 'react';
import './App.css';
//import { MDBBtn, MDBCol, MDBContainer, MDBRow } from 'mdb-react-ui-kit';
import RoutesHandler from './Routes';
import NavbarComponent from './components/Navbar/Navbar';
import FooterComponent from './components/Footer/Footer';
import {useAppSelector} from './_helpers/hooks';
import {io} from 'socket.io-client';
import axios from 'axios';
import config from './config';

function App() {
	const authentication = useAppSelector<any>(state => state.authentication);
	const curr_user = useAppSelector<any>(state => state.user);

	const [socket, setSocket] = useState<any>(null);

	useEffect(() => {
		if (authentication?.loggedIn) {
			setSocket(io(`${config.apiUrl}`));	
		}
	}, [authentication]);

	useEffect(() => {
		socket?.emit('online');	
	}, [socket])

	useEffect(() => {
		if (curr_user?.data)
			socket?.emit('setId', curr_user?.data?.login);		
	}, [socket && curr_user.data])

	useEffect(() => {
		socket?.on('youAreOnline', (online: boolean, id: string) => {
			if (online && curr_user?.data) {
				axios.patch(`${config.apiUrl}/users/myprofile`, 
					{
						online: true,
					},
					{
						withCredentials: true,
					}).then(() => {}).catch(() => {});
			}
		});	
	}, [socket && curr_user.data])

  return (
        <div className="h-100">
          <NavbarComponent />
          <div className="t_body h-100">
            <RoutesHandler>
            </RoutesHandler>
          </div>
       <FooterComponent /> 
        </div>
  );
}

export default App;
