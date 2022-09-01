import axios, { AxiosResponse } from 'axios';
import config from '../config';
import {UpdateUser} from "../interfaces/iUser";

export const channelService = {
		createChannel
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
			localStorage.setItem('channel', JSON.stringify(channel));
			return channel;
		});
}


function handleResponse(response:any) {
    if(response.status == 400)
    {
        const error = response.message || response.statusText;
        return Promise.reject(error);
    }
    return response.data;
}