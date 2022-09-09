import { channelConstants } from '../_constants';

export function channel(state = {
  updating: false,
}, action:any) {
  switch (action.type) {

	//REQUEST
  case channelConstants.CREATE_CHANNEL_REQUEST:
	case channelConstants.OPEN_CONV_REQUEST:
    return {...state,
      data: action.channel
    };
	//SUCCESS
  case channelConstants.CREATE_CHANNEL_SUCCESS:
	case channelConstants.OPEN_CONV_SUCCESS:
    return {...state,
      data: action.channel
    };
	//FAILURE
	case channelConstants.CREATE_CHANNEL_FAILURE:
	case channelConstants.OPEN_CONV_FAILURE:
		return{
			data: null
		}
		default:
			return state
	}
}