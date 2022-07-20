import { userConstants } from '../_constants';

let user = JSON.parse(localStorage.getItem('user') || "{}");
const initialState = user ? { loggedIn: true, user } : {};

export function authentication(state = initialState, action:any) {
  switch (action.type) {
    case userConstants.LOGIN_REQUEST:
      return {
        loggingIn: true,
        user: action.user
      };
    case userConstants.LOGIN_SUCCESS:
      return {
        loggedIn: true,
        user: action.user
      };
    case userConstants.WHOAMI_FAILURE:
    case userConstants.LOGIN_FAILURE:
      return {
        loggedIn: false,
        user: null
      };
    case userConstants.LOGOUT_SUCCESS:
      return {
        loggedIn: false,
        user: null
      };
    default:
      return state
  }
}