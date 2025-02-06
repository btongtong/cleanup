import { errorMsg } from "./error_message.js";

function data_api(type, url, data, onSuccess, onFail) {
    $.ajax({
        type: type,
        url: url,
        data: data,
        success: function (response) {
            if (response.success) {
                onSuccess(response);
            } else {
                onFail(response);
            }
        },
        error: function () {
            alert(errorMsg.serverError);
        }
    });
}

function no_data_api(type, url, onSuccess, onFail) {
    $.ajax({
        type: type,
        url: url,
        success: function (response) {
            if (response.success) {
                onSuccess(response);
            } else {
                onFail(response);
            }
        },
        error: function () {
            alert(errorMsg.serverError);
        }
    });
}

export { data_api, no_data_api }