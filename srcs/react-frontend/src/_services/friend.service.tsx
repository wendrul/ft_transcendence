import axios, { AxiosResponse } from 'axios';
import config from '../config';
import { UpdateUser } from '../interfaces/iUser'

export const friendService = {
    acceptRequest,
    pendingRequests,
    getFriends,
    getById
};

interface acceptParams {
    id: string,
    body: string
}

function getFriends() {
    return axios.get(`${config.apiUrl}/friendRequest/friends`,
    {
        withCredentials: true
    })
    .then((response:any) => {
        if(response == 403)
        {
            const error = response.message || response.statusText;
            return Promise.reject(error);
        }
        return response.data;
    })
}

function acceptRequest(id:string, body:string) {
    console.log(body)
    const JSobj = JSON.stringify(body)
    console.log(JSobj)
    return axios.patch(`${config.apiUrl}/friendRequest/${id}`,
    {
        status: body
    }, { 
     withCredentials: true 
    }).then((response:any) => {
        if(response == 400)
        {
            const error = response.message || response.statusText;
            return Promise.reject(error);
        }
        return response.data;
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

function pendingRequests() {
    return axios.get(`${config.apiUrl}/friendRequest/pendingRequests`, { 
        withCredentials: true 
    })
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