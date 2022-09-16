import axios from 'axios';
import config from '../config';
import { UpdateUser } from '../interfaces/iUser'

export const userService = {
    login,
    getAll,
    getById,
	getByLogin,
    getByLoginNavbar,
    whoami,
    turnOn2fa,
    turnOff2fa,
    authenticate2fa,
    signout,
    auth42,
    signup,
    updateProfile
};

function whoami() {
    return axios.get(`${config.apiUrl}/users/whoami`,
    { 
        withCredentials: true
    }).then((response:any) => {
        if(response === 403)
        {
            const error = response.message || response.statusText;
            return Promise.reject(error);
        }
        return response.data;
    })     
}

function turnOn2fa(code:string) {
    return axios.post(`${config.apiUrl}/2fa/turn-on`,
    {
           code: code
    }, { 
        withCredentials: true 
    }).then((response:any) => {
        if(response === 401)
        {
            const error = response.message || response.statusText;
            return Promise.reject(error);
        }
        return response.data;
    })
}

function turnOff2fa() {
    return axios.get(`${config.apiUrl}/2fa/turn-off`,
    { 
        withCredentials: true 
    }).then((response:any) => {
        if(response === 401)
        {
            const error = response.message || response.statusText;
            return Promise.reject(error);
        }
        return response.data;
    })
}

function authenticate2fa(code:string) {
    return axios.post(`${config.apiUrl}/2fa/authenticate`,
    {
           code: code
    }, { 
        withCredentials: true 
    }).then((response:any) => {
        if(response === 401)
        {
            const error = response.message || response.statusText;
            return Promise.reject(error);
        }
        return response.data;
    })
}

function login(email:string, password:string) {
    return axios.post(`${config.apiUrl}/users/signin`,
    {
        email: email,
        password: password
    }, { 
        withCredentials: true 
    }).then(handleResponse)
        .then(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('user', JSON.stringify(user));

            return user;
        });
}

function auth42(Token:string) { // toca cambiarlo
    return axios.post(`${config.apiUrl}/users/authApi42`,
    {
        token: Token,
    }, { 
        withCredentials: true 
    }).then(handleResponse)
        .then(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('user', JSON.stringify(user));

            return user;
        });
}

function signup(firstName:string, lastName:string, email:string, password:string) {
    return axios.post(`${config.apiUrl}/users/signup`,
    {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password
    }, { 
        withCredentials: true 
    }).then(handleResponse)
        .then(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('user', JSON.stringify(user));

            return user;
        });
}

function signout() {
    return axios.get(`${config.apiUrl}/users/signout`,
    { 
        withCredentials: true 
    }).then(response => {
        if(response.status === 200 || response.status === 201 || response.status === 401)
            return true;
        else
            return Promise.reject("ERRRRORRRRR");    
    });       
}

function updateProfile(user:UpdateUser) {
    //const JSobj = JSON.stringify(user)
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
        if(response === 400)
        {
            const error = response.message || response.statusText;
            return Promise.reject(error);
        }
        return user;
    })   
}

function getById(id: any) {
    return axios.get(`${config.apiUrl}/users/${id}`,)
    .then((response:any) => {
        if(response === 403 || response === 404)
        {
            const error = response.message || response.statusText;
            return Promise.reject(error);
        }
        return response.data;
    })
}

function getByLogin(login: string){
	return axios.get(`${config.apiUrl}/users/userByLogin/${login}`,)
		.then((response : any) => {
			if(response === 403 || response === 404)
			{
					const error = response.message || response.statusText;
					return Promise.reject(error);
			}
			return response.data;
		})
}

function getByLoginNavbar(login: string){
	return axios.get(`${config.apiUrl}/users/userByLogin/${login}`,)
		.then((response : any) => {
			if(response === 403 || response === 404)
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
        if(response === 403)
        {
            const error = response.message || response.statusText;
            return Promise.reject(error);
        }
        return response.data;
    })
}

function handleResponse(response:any) {
    if(response.status === 400)
    {
        const error = response.message || response.statusText;
        return Promise.reject(error);
    }
    return response.data;
}