import { userConstants } from '../_constants';
import { userService } from '../_services';
import { alertActions } from '.';
import { history } from '../_helpers';

export const userActions = {
    login,
    logout,
    getAll,
    whoami
};

function whoami() {
    return (dispatch:any) => {
        dispatch(request());

        userService.whoami()
            .then(
                user => {
                    dispatch(success());
                    history.push('/');
                },
                error => {
                    dispatch(failure());
                }
            );
    };

    function request() { return { type: userConstants.WHOAMI_REQUEST } }
    function success() { return { type: userConstants.WHOAMI_SUCCESS } }
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

function logout() {
    return { type: userConstants.LOGOUT };
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