import React, {useEffect, useState} from 'react';
import './App.css';
//import { MDBBtn, MDBCol, MDBContainer, MDBRow } from 'mdb-react-ui-kit';
import RoutesHandler from './Routes';
import NavbarComponent from './components/Navbar/Navbar';
import FooterComponent from './components/Footer/Footer';
import {useAppSelector} from './_helpers/hooks';
import {io} from 'socket.io-client';

function App() {
	const authentication = useAppSelector<any>(state => state.authentication);
	const [socket, setSocket] = useState<any>(null);

	// useEffect(() => {
	// if (authentication?.loggedIn) {
	// 	setSocket(io('http://localhost:3002'));	
	// }	
	// }, [authentication]);

  return (
        <div className="h-100">
          <NavbarComponent />
          <div className="t_body h-100">
            <RoutesHandler>
            </RoutesHandler>
          </div>
       {/* <FooterComponent /> */} 
        </div>
  );
}

export default App;
