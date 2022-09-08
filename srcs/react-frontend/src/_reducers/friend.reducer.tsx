import { request } from 'http';
import { friendConstants } from '../_constants';

export function friend(state = {
  updating: false,
  initial: true,
  request: []
}, action:any) {
  switch (action.type) {
    case friendConstants.PENDING_FAILURE:
      return {...state,
        updating: true
      };

    case friendConstants.PENDING_SUCCESS:
      return {...state,
        updating: false,
        updated:true,
        request: action.users
      };
    case friendConstants.PENDING_FAILURE:
      return {...state,
        updating: true,
        updated:false
      };
    default:
      return state
  }
}