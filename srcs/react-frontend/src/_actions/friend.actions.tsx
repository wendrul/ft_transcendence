import { friendConstants } from '../_constants';
import { friendService } from '../_services';
import { alertActions } from '.';

export const friendActions = {
    acceptRequest,
    pendingRequests,
    getFriends
};

function getFriends() {
    return (dispatch:any) => {
        dispatch(request());

        friendService.getFriends()
            .then(
                user => {
                    dispatch(success(user));
                },
                error => {
                    dispatch(failure(error));
                }
            );
    };

    function request() { return { type: friendConstants.GETALL_FRIENDS_REQUEST } }
    function success(user:any) { return { type: friendConstants.GETALL_FRIENDS_SUCCESS, user } }
    function failure(error:any) { return { type: friendConstants.GETALL_FRIENDS_FAILURE, error } }
}

function acceptRequest(id: string, body:string) {
    return (dispatch:any) => {
        dispatch(request());
        friendService.acceptRequest(id, body)
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

    function request() { return { type: friendConstants.ACCEPT_REQUEST } }
    function success(user:any) { return { type: friendConstants.ACCEPT_SUCCESS, user} }
    function failure(error:any) { return { type: friendConstants.ACCEPT_FAILURE, error } }
}

function pendingRequests() {
    return (dispatch:any) => {
        dispatch(request());

        friendService.pendingRequests()
            .then(
                users => {
                    dispatch(success(users));
                },
                error => {
                    dispatch(failure(error));
                }
            );
    };

    function request() { return { type: friendConstants.PENDING_REQUEST } }
    function success(users:any) { return { type: friendConstants.PENDING_SUCCESS, users } }
    function failure(error:any) { return { type: friendConstants.PENDING_FAILURE, error } }
}