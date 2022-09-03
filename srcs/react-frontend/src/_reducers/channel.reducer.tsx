import { channelConstants } from '../_constants';

export function channel(state = {
  updating: false,
}, action:any) {
  switch (action.type) {
    case channelConstants.CREATE_CHANNEL_REQUEST:
      return {...state,
        data: action.channel
      };
    case channelConstants.CREATE_CHANNEL_SUCCESS:
      return {...state,
        data: action.channel
      };
		case channelConstants.CREATE_CHANNEL_FAILURE:
			return{
				data: null
			}
			default:
				return state
		}
}