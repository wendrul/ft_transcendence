import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';

class RoutesHandler extends React.Component {
  render() {
    return (
      <Routes>
        <Route  path ='/' element={<HomePage/>} />
        <Route
          path="*"
          element={
              <p>There's nothing here!</p>
          }
        />
      </Routes>
    );
  }
}

export default RoutesHandler;