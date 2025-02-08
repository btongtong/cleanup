import { no_data_api, file_data_api } from "./ajax_api.js";
import { url } from "./url.js";

function saveImage(data, onSuccess, onFail) {
    file_data_api(
        'POST',
        url.saveFile(),
        data,
        onSuccess,
        onFail
    );
}

function deleteImage(image_url, onSuccess, onFail) {
    no_data_api(
        'DELETE',
        url.deleteFile(image_url),
        onSuccess,
        onFail
    );
}

export { saveImage, deleteImage }
