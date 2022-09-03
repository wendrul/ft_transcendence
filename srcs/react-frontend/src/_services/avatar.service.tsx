import axios, { AxiosResponse } from 'axios';
import config from '../config';
import { UpdateUser } from '../interfaces/iUser'

export const avatarService = {
    getAll,
    getById,
    updateProfile
};

function updateProfile(user:UpdateUser) {
    console.log(user)
    const JSobj = JSON.stringify(user)
    console.log(JSobj)
    return axios.patch(`${config.apiUrl}/users/myprofile`,
    {
     //   User
        firstName: user?.firstName,
        lastName: user?.lastName,
        login: user?.login,
       // twoFactorAuthenticationFlag: user?.twoFactorAuthenticationFlag,
       // email: user?.email
    }, { 
        withCredentials: true 
    }).then((response:any) => {
        if(response == 400)
        {
            const error = response.message || response.statusText;
            return Promise.reject(error);
        }
        return user;
    })   
}

function getById(id: any) {
   //return axios.get(`${config.apiUrl}/localFiles/${id}`,)
    return axios.get(`${config.apiUrl}/localFiles/1`,)
    .then((response:any) => {
        if(response == 403 || response == 404)
        {
            const error = response.message || response.statusText;
            return Promise.reject(error);
        }
        return response.data;
    })
}

function getAll() {
    return axios.get(`${config.apiUrl}/users`,)
    .then((response:any) => {
        if(response == 403)
        {
            const error = response.message || response.statusText;
            return Promise.reject(error);
        }
        return response.data;
    })
}

function handleResponse(response:any) {
    if(response.status == 400)
    {
        const error = response.message || response.statusText;
        return Promise.reject(error);
    }
    return response.data;
}