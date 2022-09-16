import axios from 'axios';
import config from '../config';
import {UpdateUser} from "../interfaces/iUser";
import {IJoinChan} from "../interfaces/IJoinChan";

export const channelService = {
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
	return axios.post(`${config.apiUrl}/chat/createChannel`,
	{
		userLogins : userLogins,
		access : access,
		password : password,
		name : name,
		owner: owner
	},
	{
		withCredentials: true
	}).then(handleResponse).then(channel => {
			return channel;
		});
}

function getOpenConversations(){
	return axios.get(`${config.apiUrl}/chat/openConversations`,
	{
		withCredentials: true
	},
	 ).then(handleResponse).then(conversation => {
		return conversation;
	});
}

function	getMyChannelsByType(type: string){
	return axios.get(`${config.apiUrl}/chat/getMyChannelsByType/${type}`,
	{
		withCredentials: true
	},
	 ).then(handleResponse).then(res => {
		return res;
	});
}

function	getChannel(name: string){
	return axios.get(`${config.apiUrl}/chat/channelData/${name}`,
	{
		withCredentials: true
	},
	 ).then(handleResponse).then(res => {
		return res;
	});
}

function	joinChannel(channel: IJoinChan){
	return axios.post(`${config.apiUrl}/chat/joinChannel`,
	{
		name: channel.name,
		password: channel?.password
	},
	{
		withCredentials: true
	}).then(handleResponse).then(res => {
		return res;
	});
}

function removePassChan(id : string) {
	return axios.get(`${config.apiUrl}/chat/removePasswordForChannel/${id}`,
	{
		withCredentials: true
	}).then(handleResponse).then(res => {
		return res;
	})
}

function editPassChan(id: string, pwd: string){
	return axios.patch(`${config.apiUrl}/chat/changePasswordForChannel/${id}`,
	{
		password: pwd
	},
	{
		withCredentials: true
	}).then(handleResponse).then(res => {
		return res;
	})
}


function handleResponse(response:any) {
    if(response.status === 400 || response.status === 404)
    {
        const error = response.message || response.statusText;
        return Promise.reject(error);
    }
    return response.data;
}