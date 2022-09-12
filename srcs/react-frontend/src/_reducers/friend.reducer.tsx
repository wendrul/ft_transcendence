import { friendConstants } from '../_constants';

export function friend(state = {
  updating: false,
  initial: true,
  accept: false,
  request: [],
  friends: []
}, action:any) {
  switch (action.type) {
    case friendConstants.PENDING_REQUEST:
    case friendConstants.ACCEPT_REQUEST:
    case friendConstants.GETALL_FRIENDS_REQUEST:
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
    case friendConstants.GETALL_FRIENDS_SUCCESS:
      return {...state,
        updating: false,
        updated: true,
        friends: action.user
      };
    case friendConstants.PENDING_SUCCESS:
      return {...state,
        updating: false,
        updated: true,
        request: action.users
      };
    case friendConstants.ACCEPT_FAILURE:
    case friendConstants.PENDING_FAILURE:
    case friendConstants.GETALL_FRIENDS_FAILURE:
      return {...state,
        updating: true,
        updated: false,
        accept: false
      };
    default:
      return state
  }
}