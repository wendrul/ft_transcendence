import { channelConstants } from '../_constants';
import { channelService } from '../_services';
import { alertActions } from '.';
import {UpdateUser} from "../interfaces/iUser";
import {IJoinChan} from "../interfaces/IJoinChan";

export const channelActions = {
	createChannel,
	getOpenConversations,
	getMyChannelsByType,
	getChannel,
	joinChannel,
	removePassChan,
	editPassChan

};

function createChannel(userLogins: string[], access: string,
	password: string, name: string, owner: UpdateUser){
		return (dispatch:any) => {
			dispatch(request());

			channelService.createChannel(userLogins, access, password, name, owner)
					.then(
							response => {dispatch(success(response));},
							error => dispatch(failure(error))
					);
	};
	function request() { return { type: channelConstants.CREATE_CHANNEL_REQUEST } }
	function success(response: any) { return { type: channelConstants.CREATE_CHANNEL_SUCCESS , response}}
	function failure(error:string) { return { type: channelConstants.CREATE_CHANNEL_FAILURE, error } }
}


function getOpenConversations(){
		return (dispatch:any) => {
			dispatch(request());

			channelService.getOpenConversations()
					.then(
							response => {
									dispatch(success(response));
							},
							error => dispatch(failure(error))
						);
	};
	function request() { return { type: channelConstants.OPEN_CONV_REQUEST } }
	function success(response:any) { return { type: channelConstants.OPEN_CONV_SUCCESS, response } }
	function failure(error:string) { return { type: channelConstants.OPEN_CONV_FAILURE, error } }
}

function getMyChannelsByType(type:string){
	return (dispatch:any) => {
		dispatch(request());

		channelService.getMyChannelsByType(type)
				.then(
						response => {
								dispatch(success(response));
						},
						error => dispatch(failure(error))
					);
};
function request() { return { type: channelConstants.GET_MY_CHAN_REQUEST } }
function success(response:any) { return { type: channelConstants.GET_MY_CHAN_SUCCESS, response } }
function failure(error:string) { return { type: channelConstants.GET_MY_CHAN_FAILURE, error } }
}


function getChannel(name:string){
	return (dispatch:any) => {
		dispatch(request());

		channelService.getChannel(name)
				.then(
						response => {
								dispatch(success(response));
								dispatch(alertActions.success("Channel Founded"));
						},
						error => {
							dispatch(failure(error))
							dispatch(alertActions.error(error));
						}
					);
};
function request() { return { type: channelConstants.GET_CHAN_REQUEST } }
function success(response:any) { return { type: channelConstants.GET_CHAN_SUCCESS, response } }
function failure(error:string) { return { type: channelConstants.GET_CHAN_FAILURE, error } }
}


function joinChannel (channel:IJoinChan){
	return (dispatch:any) => {
		dispatch(request());

		channelService.joinChannel(channel)
				.then(
						response => {
								dispatch(success(response));
						},
						error => dispatch(failure(error))
					);
};
function request() { return { type: channelConstants.JOIN_CHAN_REQUEST } }
function success(response:any) { return { type: channelConstants.JOIN_CHAN_SUCCESS, response } }
function failure(error:string) { return { type: channelConstants.JOIN_CHAN_FAILURE, error } }
}


function removePassChan(id: string){
	return (dispatch:any) => {
		dispatch(request());

		channelService.removePassChan(id)
				.then(
						response => {
								dispatch(success(response));
						},
						error => dispatch(failure(error))
					);
};
function request() { return { type: channelConstants.RM_CHAN_REQUEST } }
function success(response:any) { return { type: channelConstants.RM_CHAN_SUCCESS, response } }
function failure(error:string) { return { type: channelConstants.RM_CHAN_FAILURE, error } }
}

function editPassChan(id: string, pwd: string){
	return (dispatch:any) => {
		dispatch(request());

		channelService.editPassChan(id, pwd)
				.then(
						response => {
								dispatch(success(response));
						},
						error => dispatch(failure(error))
					);
};
function request() { return { type: channelConstants.EDIT_PWD_CHAN_REQUEST } }
function success(response:any) { return { type: channelConstants.EDIT_PWD_CHAN_SUCCESS, response } }
function failure(error:string) { return { type: channelConstants.EDIT_PWD_CHAN_FAILURE, error } }
}