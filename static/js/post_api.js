import { data_api, no_data_api } from "./ajax_api.js";
import { url } from "./url.js";

function savePost(data, onSuccess, onFail) {
    data_api(
        'POST',
        url.savePost(),
        data,
        onSuccess,
        onFail
    );
}

function checkPostPassword(pid, data, onSuccess, onFail) {
    data_api(
        'POST',
        url.checkPostPassword(pid),
        data,
        onSuccess,
        onFail
    );
}

function modifyPost(pid, data, onSuccess, onFail) {
    data_api(
        'PUT',
        url.modifyPost(pid),
        data,
        onSuccess,
        onFail
    );
}

function deletePost(pid, onSuccess, onFail) {
    no_data_api(
        'DELETE',
        url.deletePost(pid),
        onSuccess,
        onFail
    );
}

export { savePost, checkPostPassword, modifyPost, deletePost }