import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
import SignIn from './pages/SignIn/SignIn';
import SignUp from './pages/SignUp/SignUp';
import Username from './pages/Username/Username';
import History from './pages/History/History';
import Profile from './pages/Profile/Profile';
import Profileuuid from './pages/Profile/Profileuuid';
import EditProfile from './pages/Profile/EditProfile';
import CreateRoom from './pages/CreateRoom/CreateRoom';
import UsernameRedirect from './pages/Username/UsernameRedirect';
import Room from './pages/Room/Room';


class RoutesHandler extends React.Component {
  
  render() {

    return (
      <Routes>
        <Route  path ='/' element={<UsernameRedirect component={<HomePage/>} />} />
       {/* <Route  path ='/:code' element={<UsernameRedirect component={<HomePage/>} />} /> */}
        <Route  path ='/username' element={<Username/>} />
        <Route  path ='/create_room' element={<CreateRoom/>} /> {/* poner el component cuando todo sirva */}
        <Route  path ='/room/:uuid' element={<Room/>} /> {/* poner el component cuando todo sirva */}
        <Route  path ='/signin' element={<UsernameRedirect component={<SignIn/>} />} />
        <Route  path ='/signup' element={<UsernameRedirect component={<SignUp/>} />} />
        <Route  path ='/profile/:uuid' element={<UsernameRedirect component={<Profileuuid/>} />} />
        <Route  path ='/profile' element={<UsernameRedirect component={<Profile/>} />} />
        <Route  path ='/edit_profile' element={<UsernameRedirect component={<EditProfile/>} />} />
        <Route  path ='/history' element={<UsernameRedirect component={<History/>} />} />
        <Route
          path="*"
          element={
              <p>404 Error</p>
          }
        />
      </Routes>
    );
  }
}

export default RoutesHandler;