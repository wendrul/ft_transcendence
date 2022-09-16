import axios from 'axios';
import config from '../config';

export const friendService = {
    acceptRequest,
    pendingRequests,
    getFriends
};

function getFriends() {
    return axios.get(`${config.apiUrl}/friendRequest/friends`,
    {
        withCredentials: true
    })
    .then((response:any) => {
        if(response === 403)
        {
            const error = response.message || response.statusText;
            return Promise.reject(error);
        }
        return response.data;
    })
}

function acceptRequest(id:string, body:string) {
    return axios.patch(`${config.apiUrl}/friendRequest/${id}`,
    {
        status: body
    }, { 
     withCredentials: true 
    }).then((response:any) => {
        if(response === 400)
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
        if(response === 403)
        {
            const error = response.message || response.statusText;
            return Promise.reject(error);
        }
        return response.data;
    })
}
