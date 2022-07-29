import { userConstants } from '../_constants';

export function users(state : any = {
  initial: true,
  items: []
}, action:any) {
  switch (action.type) {
    case userConstants.GETOTHER_REQUEST:
    case userConstants.GETALL_REQUEST:
      return {...state,
        initial: false,
        loading: true
      };
    case userConstants.GETALL_SUCCESS:
      return {...state,
        items: action.users,
        loaded: true,
        initial: false,
      };
    case userConstants.GETALL_FAILURE:
      return { 
        loaded: false
      };
    case userConstants.GETOTHER_SUCCESS:
      return {
        item: action.users,
        loaded: true
      };
    case userConstants.GETOTHER_FAILURE:
      return {
        loaded: false,
      }
    default:
      return state
  }
}
