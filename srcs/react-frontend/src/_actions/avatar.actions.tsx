import { avatarConstants } from '../_constants';
import { avatarService } from '../_services';
import { alertActions } from '.';

export const avatarActions = {
    getAll,
    getById,
    updateProfile
};


function updateProfile(user: any) {
    return (dispatch:any) => {
        dispatch(request(user));
        avatarService.updateProfile(user)
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

    function request(user:any) { return { type: avatarConstants.UPDATE_REQUEST, user } }
    function success(user:any) { return { type: avatarConstants.UPDATE_SUCCESS, user } }
    function failure(error:any) { return { type: avatarConstants.UPDATE_FAILURE, error } }
}

function getById(id : any) {
    return (dispatch:any) => {
        dispatch(request());

        avatarService.getById(id)
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

    function request() { return { type: avatarConstants.GETOTHER_REQUEST } }
    function success(img:any) { return { type: avatarConstants.GETOTHER_SUCCESS, img } }
    function failure(error:any) { return { type: avatarConstants.GETOTHER_FAILURE, error } }
}

function getAll() {
    return (dispatch:any) => {
        dispatch(request());

        avatarService.getAll()
            .then(
                user => {
                    dispatch(success(user));
                },
                error => {
                    dispatch(failure(error));
                }
            );
    };

    function request() { return { type: avatarConstants.GETALL_REQUEST } }
    function success(users:any) { return { type: avatarConstants.GETALL_SUCCESS, users } }
    function failure(error:any) { return { type: avatarConstants.GETALL_FAILURE, error } }
}