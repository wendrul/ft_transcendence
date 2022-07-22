import { userConstants } from '../_constants';
import { userService } from '../_services';
import { alertActions } from '.';
import { history } from '../_helpers';

export const userActions = {
    login,
    signup,
    signout,
    getAll,
    whoami,
    updateUsername
};

function whoami() {
    return (dispatch:any) => {
        dispatch(request());

        userService.whoami()
            .then(
                user => {
                    dispatch(success(user));
                   // history.push('/profile');
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

function login(email:string, password:string) {
    return (dispatch:any) => {
        dispatch(request({ email }));

        userService.login(email, password)
            .then(
                user => {
                    dispatch(success(user));
                    history.push('/');
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
                    history.push('/');
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
                    history.push('/');
                },
                error => dispatch(failure(error))
            );
    };
    function request() { return { type: userConstants.LOGOUT_REQUEST } }
    function success() { return { type: userConstants.LOGOUT_SUCCESS } }
    function failure(error:string) { return { type: userConstants.LOGOUT_FAILURE, error } }
}

function updateUsername(id:string, username:string) {
    return (dispatch:any) => {
        dispatch(request({ username }));

        userService.updateUsername(id, username)
            .then(
                user => {
                    dispatch(success(user));
                    history.push('/');
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

function getAll() {
    return (dispatch:any) => {
        dispatch(request());

        userService.getAll()
            .then(
                users => dispatch(success(users)),
                error => dispatch(failure(error))
            );
    };

    function request() { return { type: userConstants.GETALL_REQUEST } }
    function success(users:any) { return { type: userConstants.GETALL_SUCCESS, users } }
    function failure(error:any) { return { type: userConstants.GETALL_FAILURE, error } }
}