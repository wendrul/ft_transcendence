import { channelConstants } from '../_constants';

export function channel(state = {
  updating: false,
}, action:any) {
  switch (action.type) {
    case channelConstants.CREATE_REQUEST:
      return {...state,
        data: action.channel
      };
    case channelConstants.CREATE_SUCCESS:
      return {...state,
        updating: true,
        data: action.user
      };
		case channelConstants.CREATE_FAILURE:
			return{
			}
			default:
				return state
		}
}