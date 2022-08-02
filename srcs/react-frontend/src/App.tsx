import React from 'react';
import './App.css';
//import { MDBBtn, MDBCol, MDBContainer, MDBRow } from 'mdb-react-ui-kit';
import RoutesHandler from './Routes';
import NavbarComponent from './components/Navbar/Navbar';
import FooterComponent from './components/Footer/Footer';

function App() {
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
