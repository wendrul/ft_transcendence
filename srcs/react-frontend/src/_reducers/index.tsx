import { combineReducers } from 'redux';

import { authentication } from './authentication.reducer';
import { users } from './users.reducer';
import { user } from './user.reducer';
import { alert } from './alert.reducer';
import { avatars } from './avatars.reducer';
import { avatar } from './avatar.reducer';

const rootReducer = combineReducers({
  authentication,
  users,
  user,
  avatar,
  avatars,
  alert
});

export default rootReducer;