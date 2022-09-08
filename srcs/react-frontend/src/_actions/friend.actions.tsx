import { friendConstants } from '../_constants';
import { friendService } from '../_services';
import { alertActions } from '.';

export const friendActions = {
    pendingRequests,
    getById,
    updateProfile
};


function updateProfile(user: any) {
    return (dispatch:any) => {
        dispatch(request(user));
        friendService.updateProfile(user)
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

    function request(user:any) { return { type: friendConstants.UPDATE_REQUEST, user } }
    function success(user:any) { return { type: friendConstants.UPDATE_SUCCESS, user } }
    function failure(error:any) { return { type: friendConstants.UPDATE_FAILURE, error } }
}

function getById(id : any) {
    return (dispatch:any) => {
        dispatch(request());

        friendService.getById(id)
            .then(
                img => {
                    console.log(img);
                    dispatch(success(img));
                },
                error => {
                    dispatch(failure(error));
                }
            );
    };

    function request() { return { type: friendConstants.GETOTHER_REQUEST } }
    function success(img:any) { return { type: friendConstants.GETOTHER_SUCCESS, img } }
    function failure(error:any) { return { type: friendConstants.GETOTHER_FAILURE, error } }
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