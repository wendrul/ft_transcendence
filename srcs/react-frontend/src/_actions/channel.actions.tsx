import { channelConstants } from '../_constants';
import { channelService } from '../_services';
import { alertActions } from '.';
import {UpdateUser} from "../interfaces/iUser";

export const channelActions = {
	createChannel,
	getOpenConversations
};

function createChannel(userLogins: string[], access: string,
	password: string, name: string, owner: UpdateUser){
		return (dispatch:any) => {
			dispatch(request());

			channelService.createChannel(userLogins, access, password, name, owner)
					.then(
							response => {
									dispatch(success());
							},
							error => dispatch(failure(error))
					);
	};
	function request() { return { type: channelConstants.CREATE_CHANNEL_REQUEST } }
	function success() { return { type: channelConstants.CREATE_CHANNEL_SUCCESS } }
	function failure(error:string) { return { type: channelConstants.CREATE_CHANNEL_FAILURE, error } }
}


function getOpenConversations(user: UpdateUser){
		return (dispatch:any) => {
			dispatch(request());

			channelService.getOpenConversations(user)
					.then(
							response => {
									dispatch(success());
							},
							error => dispatch(failure(error))
					);
	};
	function request() { return { type: channelConstants.OPEN_CONV_REQUEST } }
	function success() { return { type: channelConstants.OPEN_CONV_SUCCESS } }
	function failure(error:string) { return { type: channelConstants.OPEN_CONV_FAILURE, error } }
}


