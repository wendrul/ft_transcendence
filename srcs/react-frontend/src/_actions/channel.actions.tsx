import { channelConstants } from '../_constants';
import { channelService } from '../_services';
import { alertActions } from '.';
import {UpdateUser} from "../interfaces/iUser";

export const channelActions = {
	createChannel,
	// createMessageForUser
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



// function createMessageForUser(content: string, user: UpdateUser, id: number){
// 		return (dispatch:any) => {
// 			dispatch(request());

// 			channelService.createMessageForUser(content, user, id)
// 					.then(
// 							response => {
// 									dispatch(success());
// 							},
// 							error => dispatch(failure(error))
// 					);
// 	};
// 	function request() { return { type: channelConstants.CREATE_MSG_FOR_REQUEST } }
// 	function success() { return { type: channelConstants.CREATE_MSG_FOR_SUCCESS } }
// 	function failure(error:string) { return { type: channelConstants.CREATE_MSG_FOR_FAILURE, error } }
// }