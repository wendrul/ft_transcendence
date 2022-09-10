import { channelConstants } from '../_constants';

export function channel(state = {
  updating: false,
	data : []
}, action:any) {
  switch (action.type) {

	//REQUEST,
  case channelConstants.CREATE_CHANNEL_REQUEST:
	case channelConstants.OPEN_CONV_REQUEST:
    return {...state,
			updating: true,
			updated: false
    };
	//SUCCESS
  case channelConstants.CREATE_CHANNEL_SUCCESS:
	case channelConstants.OPEN_CONV_SUCCESS:
    return {...state,
			data: action.response,
			updating: false,
			updated: true
    };
	//FAILURE
	case channelConstants.CREATE_CHANNEL_FAILURE:
	case channelConstants.OPEN_CONV_FAILURE:
    return {...state,
			data: null,
			updating:false,
			updated: false
		};

		//DEFAULT
		default:
			return state
	}
}