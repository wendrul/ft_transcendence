import { userConstants } from '../_constants';

export function users(state : any = {
  initial: true,
  items: []
}, action:any) {
  switch (action.type) {

		// REQUEST
    case userConstants.GETOTHER_REQUEST:
    case userConstants.GETALL_REQUEST:
      return {...state,
        initial: false,
        loading: true
      };
		case userConstants.GETLOGIN_REQUEST:
			return{...state,
		};


		// SUCCESS
    case userConstants.GETALL_SUCCESS:
      return {...state,
        items: action.users,
        loaded: true,
        initial: false,
      };
		case userConstants.GETOTHER_SUCCESS:
			return {
				item: action.users,
				loaded: true
			};
			case userConstants.GETLOGIN_SUCCESS:
				return{...state,
				item: action.users,
				loged: true
			};

		// FAILURE
		case userConstants.GETALL_FAILURE:
      return { 
        loaded: false
      };
    case userConstants.GETOTHER_FAILURE:
      return {
        loaded: false,
      }
		case userConstants.GETLOGIN_FAILURE:
			return{...state,
      item: null,
			loged: false
		};


		//DEFAULT
    default:
      return state
  }
}