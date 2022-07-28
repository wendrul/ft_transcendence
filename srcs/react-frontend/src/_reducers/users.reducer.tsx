import { userConstants } from '../_constants';

export function users(state : any = {}, action:any) {
  switch (action.type) {
    case userConstants.GETALL_REQUEST:
      return {...state,
        items: action.users,
        loading: true
      };
    case userConstants.GETALL_SUCCESS:
      return {...state,
        items: action.users,
        loaded: true
      };
    case userConstants.GETALL_FAILURE:
      return { 
        error: action.error,
        loaded: false
      };
    default:
      return state
  }
}