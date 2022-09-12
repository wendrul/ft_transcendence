import { channelConstants } from '../_constants';

export function channel(state = {
  updating: false,
	data : []
}, action:any) {
  switch (action.type) {

	//REQUEST,
  case channelConstants.JOIN_CHAN_REQUEST:
		return {...state,
			joining: true
		}
  case channelConstants.GET_CHAN_REQUEST:
		return{...state,
			searching: true,
		}
  case channelConstants.GET_MY_CHAN_REQUEST:
  case channelConstants.CREATE_CHANNEL_REQUEST:
	case channelConstants.OPEN_CONV_REQUEST:
    return {...state,
			updating: true,
			updated: false
    };

		//SUCCESS
	case channelConstants.JOIN_CHAN_SUCCESS:
		return {...state,
			joined: true,
			joining: false
		}
	case channelConstants.GET_CHAN_SUCCESS:
		return{...state,
		search: action.response,
		searching: false
	}
	case channelConstants.GET_MY_CHAN_SUCCESS:
  case channelConstants.CREATE_CHANNEL_SUCCESS:
	case channelConstants.OPEN_CONV_SUCCESS:
    return {...state,
			data: action.response,
			updating: false,
			updated: true
    };


	//FAILURE
	case channelConstants.JOIN_CHAN_FAILURE:
		return {...state,
			joined: false,
			joining: false
		}
	case channelConstants.GET_CHAN_FAILURE:
		return{...state,
			search: null,
			searching: false
		}
	case channelConstants.GET_MY_CHAN_FAILURE:
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