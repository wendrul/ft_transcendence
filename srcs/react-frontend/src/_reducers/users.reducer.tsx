import { userConstants } from '../_constants';

export function users(state : any = {
  initial: true,
  items: []
}, action:any) {
  switch (action.type) {
    case userConstants.GETOTHER_REQUEST:
		// case userConstants.GETLOGIN_REQUEST:
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
      return {...state,
        loaded: false
      };
			// case userConstants.GETLOGIN_SUCCESS:
			// 	return {...state,
			// 		loaded: true,
			// 		item: action.users,
			// 		loged: true,
			// 	}
			case userConstants.GETOTHER_SUCCESS:
      return {...state,
        item: action.users,
        loaded: true
      };
		// case userConstants.GETLOGIN_FAILURE:
		// 	return {...state,
		// 		loaded: false,
		// 		item: null,
		// 		loged: false,
		// 	}
    case userConstants.GETOTHER_FAILURE:
      return {...state,
        loaded: false,
				item: null
			}
    default:
      return state
  }
}
