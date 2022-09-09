import { request } from 'http';
import { friendConstants } from '../_constants';

export function friend(state = {
  updating: false,
  initial: true,
  accept: false,
  request: []
}, action:any) {
  switch (action.type) {
    case friendConstants.PENDING_FAILURE:
    case friendConstants.ACCEPT_REQUEST:
      return {...state,
        updating: true,
        accept: false
      };
    case friendConstants.ACCEPT_SUCCESS:
        return {...state,
          updating: false,
          updated: true,
          accept: true
        };
    case friendConstants.PENDING_SUCCESS:
      return {...state,
        updating: false,
        updated: true,
        request: action.users
      };
      case friendConstants.ACCEPT_FAILURE:
    case friendConstants.PENDING_FAILURE:
      return {...state,
        updating: true,
        updated: false,
        accept: false
      };
    default:
      return state
  }
}