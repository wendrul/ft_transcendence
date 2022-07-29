import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
import SignIn from './pages/SignIn/SignIn';
import SignUp from './pages/SignUp/SignUp';
import Username from './pages/Username/Username';
import History from './pages/History/History';
import Profile from './pages/Profile/Profile';
import Dashboard from './pages/Dashboard/Dashboard';

class RoutesHandler extends React.Component {
  render() {
    return (
      <Routes>
        <Route  path ='/' element={<HomePage/>} />
        <Route  path ='/:code' element={<HomePage/>} />
        <Route  path ='/username' element={<Username/>} />
        <Route  path ='/signin' element={<SignIn/>} />
        <Route  path ='/signup' element={<SignUp/>} />
        <Route  path ='/profile' element={<Profile/>} />
        <Route  path ='/history' element={<History/>} />
        <Route  path ='/dashboard' element={<Dashboard/>} />
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