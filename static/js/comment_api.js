import { data_api, no_data_api } from "./ajax_api.js";
import { url } from "./url.js";

function getComments(pid, onSuccess, onFail) {
    no_data_api(
        'GET',
        url.getComments(pid),
        onSuccess,
        onFail
    );
}

function saveComment(pid, data, onSuccess, onFail) {
    data_api(
        'POST',
        url.saveComment(pid),
        data,
        onSuccess,
        onFail
    );
}

function checkCommentPassword(pid, cid, data, onSuccess, onFail) {
    data_api(
        'POST',
        url.checkCommentPassword(pid, cid),
        data,
        onSuccess,
        onFail
    );
}

function modifyComment(pid, cid, data, onSuccess, onFail) {
    data_api(
        'PUT',
        url.modifyComment(pid, cid),
        data,
        onSuccess,
        onFail
    );
}

function deleteComment(pid, cid, onSuccess, onFail) {
    no_data_api(
        'DELETE',
        url.deleteComment(pid, cid),
        onSuccess,
        onFail
    );
}

export { getComments, saveComment, checkCommentPassword, modifyComment, deleteComment }
