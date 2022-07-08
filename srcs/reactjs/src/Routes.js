import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';

class RoutesHandler extends React.Component {
  render() {
    return (
      <Routes>
        <Route exact path ='/' element={<HomePage/>} />
        
        <Route
          render={function() {
            return <h1>Not Found</h1>;
          }}
        />
      </Routes>
    );
  }
}

export default RoutesHandler;