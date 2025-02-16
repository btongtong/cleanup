// 이미지 업로드 함수
import { saveImage, deleteImage } from "./file_api.js";
import { createImageElement } from "./post_elements.js";

function uploadImage(file, uploadedImages) {
    var data = new FormData();
    data.append('image', file);

    saveImage(
        data,
        (response) => {
            const url = response.url;
            // 이미지 넣기
            insertImage(createImageElement(url));
            // 업로드된 이미지 URL 반환
            uploadedImages.push(url);
        },
        (response) => alert(errorMsg.imageUploadError)
    );
}

// 이미지를 특정 <p> 태그 내에 삽입하는 함수
function insertImage(imageHtml) {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const node = range.startContainer;

        // 입력 커서가 위치한 <p> 태그를 찾기
        let targetP = null;
        if (node.nodeName === '#text') {
            targetP = $(node.parentNode);
        } else if (node.nodeName === 'P') {
            targetP = $(node);
        } 

        if (targetP.length > 0) {
            targetP.append(imageHtml);

            // 추가된 이미지 요소를 찾아서 그 다음에 커서를 위치시킵니다.
            const imgElement = $(targetP).find('img:last');
            if(imgElement.length > 0) {
                const newRange = document.createRange();
                newRange.setStartAfter(imgElement[0]);
                newRange.collapse(true);
                selection.removeAllRanges();
                selection.addRange(newRange);
            }
        }
    } else {
        // 포커스가 없는 경우 placeholder 처리
        const placeholder = $('.editor .placeholder');
        if (placeholder.length > 0) {
            placeholder.remove();
            $('.editor').html('<p>'+imageHtml+'</p>');
        }
    }
}

function removeImage(url){
    deleteImage(
        encodeURIComponent(url),
        (response) => {},
        (response) => alert(errorMsg.imageDeleteError)
    );
}

export { uploadImage, removeImage }