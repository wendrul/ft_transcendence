import { avatarConstants } from '../_constants';

export function avatar(state = {
  updating: false
}, action:any) {
  switch (action.type) {
    case avatarConstants.UPDATE_REQUEST:
      return {...state,
        updating: true
      };

    case avatarConstants.UPDATE_SUCCESS:
      return {...state,
        updated: true,
        updating: false,
        data: action.user
      };
    case avatarConstants.UPDATE_FAILURE:
      return {...state,
        updated: false,
        updating: false
      };
    default:
      return state
  }
}