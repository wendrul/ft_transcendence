import { combineReducers } from 'redux';

import { authentication } from './authentication.reducer';
import { users } from './users.reducer';
import { user } from './user.reducer';
import { alert } from './alert.reducer';
import { channel } from './channel.reducer';

const rootReducer = combineReducers({
  authentication,
  users,
  user,
  alert,
	channel
});

export default rootReducer;