import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
import SignIn from './pages/SignIn/SignIn';
import SignUp from './pages/SignUp/SignUp';

class RoutesHandler extends React.Component {
  render() {
    return (
      <Routes>
        <Route  path ='/' element={<HomePage/>} />
		<Route  path ='/signin' element={<SignIn/>} />
		<Route  path ='/signup' element={<SignUp/>} />
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