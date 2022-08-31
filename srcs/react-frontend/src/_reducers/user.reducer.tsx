import { userConstants } from '../_constants';

export function user(state = {
  updating: false,
}, action:any) {
  switch (action.type) {
    case userConstants.SIGNUP_REQUEST:
    case userConstants.LOGIN_REQUEST:
    case userConstants.WHOAMI_REQUEST:
      return {...state,
        data: action.user
      };
    case userConstants.UPDATE_REQUEST:
      return {...state,
        updating: true
      };
    case userConstants.SIGNUP_SUCCESS:
    case userConstants.WHOAMI_SUCCESS:
    case userConstants.LOGIN_SUCCESS:
      return {...state,
        data: action.user
      };
    case userConstants.UPDATE_SUCCESS:
      return {...state,
        updated: true,
        updating: false,
        data: action.user
      };
    case userConstants.LOGOUT_SUCCESS:
    case userConstants.WHOAMI_FAILURE:
    case userConstants.SIGNUP_FAILURE:
    case userConstants.LOGIN_FAILURE:
      return {
        data: null
      };
    case userConstants.UPDATE_FAILURE:
      return {...state,
        updated: false,
        updating: false
      };
    default:
      return state
  }
}