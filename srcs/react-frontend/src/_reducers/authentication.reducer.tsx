import { userConstants } from '../_constants';

export function authentication(state = {
  loggedIn: false
}, action:any) {
  switch (action.type) {
    case userConstants.SIGNUP_REQUEST:
    case userConstants.LOGIN_REQUEST:
      return {
        loggingIn: true,
        user: action.user
      };
      case userConstants.SIGNUP_SUCCESS:
    case userConstants.WHOAMI_SUCCESS:
    case userConstants.LOGIN_SUCCESS:
      return {
        loggedIn: true,
        user: action.user
      };
    case userConstants.LOGOUT_SUCCESS:
    case userConstants.WHOAMI_FAILURE:
    case userConstants.SIGNUP_FAILURE:
    case userConstants.LOGIN_FAILURE:
      return {
        loggedIn: false,
        user: null
      };
    default:
      return state
  }
}