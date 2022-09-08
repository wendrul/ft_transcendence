import { friendConstants } from '../_constants';

export function friend(state = {
  updating: false
}, action:any) {
  switch (action.type) {
    case friendConstants.UPDATE_REQUEST:
      return {...state,
        updating: true
      };

    case friendConstants.UPDATE_SUCCESS:
      return {...state,
        updating: false
      };
    case friendConstants.UPDATE_FAILURE:
      return {...state,
        updating: true
      };
    default:
      return state
  }
}