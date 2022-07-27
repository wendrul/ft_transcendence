import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
import SignIn from './pages/SignIn/SignIn';
import SignUp from './pages/SignUp/SignUp';
import Username from './pages/Username/Username';
import History from './pages/History/History';
import Profile from './pages/Profile/Profile';
import { useAppSelector } from './_helpers/hooks';
import UsernameRedirect from './pages/Username/UsernameRedirect';


class RoutesHandler extends React.Component {
  
  render() {

    return (
      <Routes>
        <Route  path ='/' element={<UsernameRedirect component={<HomePage/>} />} />
        <Route  path ='/:code' element={<UsernameRedirect component={<HomePage/>} />} />
        <Route  path ='/username' element={<Username/>} />
        <Route  path ='/signin' element={<UsernameRedirect component={<SignIn/>} />} />
        <Route  path ='/signup' element={<UsernameRedirect component={<SignUp/>} />} />
        <Route  path ='/profile' element={<UsernameRedirect component={<Profile/>} />} />
        <Route  path ='/history' element={<UsernameRedirect component={<History/>} />} />
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