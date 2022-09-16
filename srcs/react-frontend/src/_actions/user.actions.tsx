import { userConstants } from '../_constants';
import { userService } from '../_services';
import { alertActions } from '.';
import { UpdateUser } from '../interfaces/iUser'

export const userActions = {
    login,
    signup,
    signout,
    auth42,
    turnOn2fa,
    turnOff2fa,
    authenticate2fa,
    getAll,
    getById,
	getByLogin,
    getByLoginNavbar,
    whoami,
    updateProfile
};

function whoami() {
    return (dispatch:any) => {
        dispatch(request());

        userService.whoami()
            .then(
                user => {
                    dispatch(success(user));
                },
                error => {
                    dispatch(failure());
                }
            );
    };

    function request() { return { type: userConstants.WHOAMI_REQUEST } }
    function success(user:any) { return { type: userConstants.WHOAMI_SUCCESS, user } }
    function failure() { return { type: userConstants.WHOAMI_FAILURE } }
}

function turnOn2fa(code:string) {
    return (dispatch:any) => {
        dispatch(request());

        userService.turnOn2fa(code)
            .then(
                user => {
                    dispatch(success(user));
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                }
            );
    };

    function request() { return { type: userConstants.TURN2FA_REQUEST } }
    function success(user:any) { return { type: userConstants.TURN2FA_SUCCESS, user } }
    function failure(error:any) { return { type: userConstants.TURN2FA_FAILURE, error } }
}

function turnOff2fa() {
    return (dispatch:any) => {
        dispatch(request());

        userService.turnOff2fa()
        .then(
            response => {
                dispatch(success());
            },
            error => dispatch(failure(error))
        );
};

    function request() { return { type: userConstants.TURN_OFF2FA_REQUEST } }
    function success() { return { type: userConstants.TURN_OFF2FA_SUCCESS } }
    function failure(error:any) { return { type: userConstants.TURN_OFF2FA_FAILURE, error } }
}

function authenticate2fa(code:string) {
    return (dispatch:any) => {
        dispatch(request());

        userService.authenticate2fa(code)
            .then(
                user => {
                    dispatch(success(user));
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                }
            );
    };

    function request() { return { type: userConstants.AUTHENTIFICATE2FA_REQUEST } }
    function success(user:any) { return { type: userConstants.AUTHENTIFICATE2FA_SUCCESS, user } }
    function failure(error:any) { return { type: userConstants.AUTHENTIFICATE2FA_FAILURE, error } }
}

function auth42(Token:string) {
    return (dispatch:any) => {
        dispatch(request({ Token }));

        userService.auth42(Token)
            .then(
                user => {
                    dispatch(success(user));
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                }
            );
    };

    function request(user:any) { return { type: userConstants.AUTH42_REQUEST, user } }
    function success(user:any) { return { type: userConstants.AUTH42_SUCCESS, user } }
    function failure(error:any) { return { type: userConstants.AUTH42_FAILURE, error } }
}

function login(email:string, password:string) {
    return (dispatch:any) => {
        dispatch(request({ email }));

        userService.login(email, password)
            .then(
                user => {
                    dispatch(success(user));
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                }
            );
    };

    function request(user:any) { return { type: userConstants.LOGIN_REQUEST, user } }
    function success(user:any) { return { type: userConstants.LOGIN_SUCCESS, user } }
    function failure(error:any) { return { type: userConstants.LOGIN_FAILURE, error } }
}

function signup(firsName:string, lastName:string, email:string, password:string) {
    return (dispatch:any) => {
        dispatch(request({ email }));

        userService.signup(firsName, lastName, email, password)
            .then(
                user => {
                    dispatch(success(user));
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                }
            );
    };

    function request(user:any) { return { type: userConstants.SIGNUP_REQUEST, user } }
    function success(user:any) { return { type: userConstants.SIGNUP_SUCCESS, user } }
    function failure(error:any) { return { type: userConstants.SIGNUP_FAILURE, error } }
}

function signout() {
    return (dispatch:any) => {
        dispatch(request());

        userService.signout()
            .then(
                response => {
                    dispatch(success());
                },
                error => dispatch(failure(error))
            );
    };
    function request() { return { type: userConstants.LOGOUT_REQUEST } }
    function success() { return { type: userConstants.LOGOUT_SUCCESS } }
    function failure(error:string) { return { type: userConstants.LOGOUT_FAILURE, error } }
}

function updateProfile(user: UpdateUser) {
    return (dispatch:any) => {
        dispatch(request(user));
        userService.updateProfile(user)
            .then(
                user => {
                    dispatch(success(user));
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                }
            );
    };

    function request(user:any) { return { type: userConstants.UPDATE_REQUEST, user } }
    function success(user:any) { return { type: userConstants.UPDATE_SUCCESS, user } }
    function failure(error:any) { return { type: userConstants.UPDATE_FAILURE, error } }
}

function getById(id : any) {
    return (dispatch:any) => {
        dispatch(request());

        userService.getById(id)
            .then(
                user => {
                    dispatch(success(user));
                },
                error => {
                    dispatch(failure(error));
                }
            );
    };

    function request() { return { type: userConstants.GETOTHER_REQUEST } }
    function success(users:any) { return { type: userConstants.GETOTHER_SUCCESS, users } }
    function failure(error:any) { return { type: userConstants.GETOTHER_FAILURE, error } }
}

function getByLogin(login: string){
	return (dispatch: any) => {
			dispatch(request());
        userService.getByLogin(login)
            .then( user =>{
                    dispatch(success(user));
                    dispatch(alertActions.success("User Founded"));
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                }

            );
    };
	function request() { return { type: userConstants.GETLOGIN_REQUEST } }
	function success(users:any) { return { type: userConstants.GETLOGIN_SUCCESS, users } }
	function failure(error:any) { return { type: userConstants.GETLOGIN_FAILURE, error } }
}

function getByLoginNavbar(login: string){
	return (dispatch: any) => {
			dispatch(request());
        userService.getByLogin(login)
            .then( user =>{
                    dispatch(success(user));
                    dispatch(alertActions.clear());
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                }

            );
    };
	function request() { return { type: userConstants.NAV_GETLOGIN_REQUEST } }
	function success(users:any) { return { type: userConstants.NAV_GETLOGIN_SUCCESS, users } }
	function failure(error:any) { return { type: userConstants.NAV_GETLOGIN_FAILURE, error } }
}

function getAll() {
    return (dispatch:any) => {
        dispatch(request());

        userService.getAll()
            .then(
                user => {
                    dispatch(success(user));
                },
                error => {
                    dispatch(failure(error));
                }
            );
    };

    function request() { return { type: userConstants.GETALL_REQUEST } }
    function success(users:any) { return { type: userConstants.GETALL_SUCCESS, users } }
    function failure(error:any) { return { type: userConstants.GETALL_FAILURE, error } }
}