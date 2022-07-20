import React from 'react';
import './App.css';
//import { MDBBtn, MDBCol, MDBContainer, MDBRow } from 'mdb-react-ui-kit';
import RoutesHandler from './Routes';
import NavbarComponent from './components/Navbar/Navbar';
import FooterComponent from './components/Footer/Footer';
import Checker from './components/Checker/Checker';

function App() {
  return (
    <>      <Checker />
        <div className="h-100">
          <NavbarComponent />
          <div className="t_body h-100">
            <RoutesHandler>
            </RoutesHandler>
          </div>
        <FooterComponent />
        </div>
        </>
  );
}

export default App;
