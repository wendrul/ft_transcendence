import React from 'react';
import { MDBBtn, MDBCol, MDBContainer, MDBRow } from 'mdb-react-ui-kit';
import NavbarComponent from './components/Navbar/Navbar';
import "./App.css"
import RoutesHandler from './Routes';

function App() {
  return (
    <div className="h-100">
      <NavbarComponent />
      <div className="t_body h-100">
        <RoutesHandler>
        </RoutesHandler>
      </div>
    </div>
  );
}

export default App;
