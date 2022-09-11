import { userConstants } from '../_constants';

export function authentication(state = {
  loggedIn: false,
  initial: true
}, action:any) {
  switch (action.type) {
    case userConstants.SIGNUP_REQUEST:
    case userConstants.LOGIN_REQUEST:
    case userConstants.WHOAMI_REQUEST:
      return {
        loggingIn: true
      };
    case userConstants.UPDATE_SUCCESS:
    case userConstants.SIGNUP_SUCCESS:
    case userConstants.WHOAMI_SUCCESS:
    case userConstants.LOGIN_SUCCESS:
      return {
        loggedIn: true,
        loggingIn: false
      };
    case userConstants.LOGOUT_SUCCESS:
    case userConstants.WHOAMI_FAILURE:
    case userConstants.SIGNUP_FAILURE:
    case userConstants.LOGIN_FAILURE:
      return {
        loggedIn: false,
        loggingIn: false
      };
    default:
      return state
  }
}