import { userConstants } from '../_constants';

export function user(state = {
  updating: false,
  validating: false,
  bool2fa: false
}, action:any) {
  switch (action.type) {
    case userConstants.SIGNUP_REQUEST:
    case userConstants.LOGIN_REQUEST:
    case userConstants.WHOAMI_REQUEST:
      return {...state,
        data: action.user
      };
    case userConstants.TURN2FA_REQUEST:
    case userConstants.TURN_OFF2FA_REQUEST:
    case userConstants.AUTHENTIFICATE2FA_REQUEST:
      return {...state,
        validating: true
      };
    case userConstants.UPDATE_REQUEST:
      return {...state,
        updating: true
      };
    case userConstants.SIGNUP_SUCCESS:
    case userConstants.WHOAMI_SUCCESS:
    case userConstants.LOGIN_SUCCESS:
      return {...state,
        data: action.user,
      };
    case userConstants.AUTHENTIFICATE2FA_SUCCESS:
      return {...state,
        data: action.user,
        bool2fa: true
      };
    case userConstants.TURN2FA_SUCCESS:
      return {...state,
        validated: true,
        validating: false,
      }
    case userConstants.TURN_OFF2FA_SUCCESS:
      return {...state,
        validated: false,
        validating: false,
      }
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
    case userConstants.AUTHENTIFICATE2FA_FAILURE:
      return {
        data: null
      };
    case userConstants.TURN2FA_FAILURE:
    case userConstants.TURN_OFF2FA_FAILURE:
      return {...state,
        validated: false,
        validating: false,
      }
    case userConstants.UPDATE_FAILURE:
      return {...state,
        updated: false,
        updating: false
      };
    default:
      return state
  }
}