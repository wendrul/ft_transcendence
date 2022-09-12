import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
import SignIn from './pages/SignIn/SignIn';
import SignUp from './pages/SignUp/SignUp';
import Username from './pages/Username/Username';
import History from './pages/History/History';
import Historyuuid from './pages/History/Historyuuid';
import Profile from './pages/Profile/Profile';
import Profileuuid from './pages/Profile/Profileuuid';

import EditProfile from './pages/Profile/Edit/EditProfile';

import Edit2fa from './pages/Profile/Edit/Edit2fa';
import EditInfo from './pages/Profile/Edit/EditInfo';
import EditPhoto from './pages/Profile/Edit/EditPhoto';

import FriendRequest from './pages/Friends/FriendRequest';
import Leaderboard from './pages/Leaderboard/Leaderboard';


import CreateRoom from './pages/CreateRoom/CreateRoom';
import UsernameRedirect from './pages/Username/UsernameRedirect';
import Room from './pages/Room/Room';
import WebChat from './pages/WebChat/WebChat';
import ChatRoom from './pages/WebChat/ChatRoom';
import DirectMessage from './pages/WebChat/DirectMessage';
import Authenticate2fa from './pages/Authenticate2fa/Authenticate2fa';
import GameComponent, { GameSettingsTest } from './GameComponent';

class RoutesHandler extends React.Component {
  
  render() {

    return (
      <Routes>
        <Route  path ='/' element={<UsernameRedirect component={<HomePage/>} />} />
       {/* <Route  path ='/:code' element={<UsernameRedirect component={<HomePage/>} />} /> */}
        <Route  path ='/username' element={<Username/>} />

        <Route  path ='/Authenticate2fa' element={<Authenticate2fa/>} />

        <Route  path ='/create_room' element={<CreateRoom/>} />
        <Route  path ='/room/:uuid' element={<Room/>} />
        <Route  path ='/signin' element={<SignIn/>}/>
        <Route  path ='/signup' element={<SignUp/>}/>
        <Route  path ='/profile/:uuid' element={<Profileuuid/>}/>
        <Route  path ='/profile' element={<Profile/>}/>

        <Route  path ='/Leaderboard' element={<Leaderboard/>}/>

        <Route  path ='/edit_profile' element={<EditProfile/>}/>
        <Route  path ='/edit_2fa' element={<Edit2fa/>}/>
        <Route  path ='/edit_info' element={<EditInfo/>}/>
        <Route  path ='/edit_photo' element={<EditPhoto/>}/>

        <Route  path ='/friends' element={<FriendRequest/>}/>

        <Route  path ='/history' element={<History/>}/>
        <Route  path ='/history/:uuid' element={<Historyuuid/>}/>
        <Route  path ='/web_chat' element={<WebChat/>} />
        <Route  path ='/chat_room' element={<ChatRoom/>} />
        <Route  path ='/direct_message/:id' element={<DirectMessage/>} />
        <Route  path ='/game-test' element={<GameComponent username={"pogTester"} roomID={""} test={true} />}/>
        <Route  path ='/game-test2' element={<GameSettingsTest />}/>
        <Route
          path="*"
          element={
							<div className="d-flex justify-content-center align-items-center mt-4">
              	<h1>404 Error</h1>
							</div>
          }
        />
      </Routes>
    );
  }
}

export default RoutesHandler;
