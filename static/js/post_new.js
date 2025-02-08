import { url } from "./url.js";
import { savePost } from "./post_api.js";
import { errorMsg } from "./error_message.js";
import { isValidPassword } from "./password.js";
import { saveImage, deleteImage } from "./file_api.js";
import { createNoContentElement, createImageElement } from "./post_elements.js";

$(document).ready(function () {
    var uploadedImages = [];  // 업로드된 이미지 URL을 저장하는 배열

    // 게시글 등록 로직
    $('#postSubmit').click(function () {
        const title = $('textarea.title').val().trim();  // trim()을 사용하여 양쪽 공백 제거
        const content = $('.editor').html();
        const username = $('#username').val().trim();
        const password = $('#password').val().trim();

        // 필수 입력 필드가 비어 있는지 확인
        if (title === '' || content === createNoContentElement() || username === '' || password === '') {
            alert(errorMsg.fillOutError); 
            return;  
        }

        // 비밀번호 유효성 검사
        if (!isValidPassword(password)) {
            alert(errorMsg.passwordFormatError);
            return;
        }

        // 현재 에디터에 있는 이미지 URL을 수집
        var currentImages = [];
        $('.editor img').each(function() {
            currentImages.push($(this).attr('src'));
        });

        // 삭제된 이미지를 찾아 서버에서 삭제
        uploadedImages.forEach(function(imageUrl) {
            if (!currentImages.includes(imageUrl)) {
                removeImage(imageUrl);
            }
        });

        savePost(
            { title: title, content: content, username: username, password: password}, 
            (response) => window.location.href = url.getPost(response.pid),
            (response) =>  alert(errorMsg.postCreateError)
        );
    });

    const editor = $('.editor');

    $('.content').on('click', function() {
        editor.focus();
    })

    // 처음 입력할 때 값이 없으면 p추가
    editor.on('input', function() {
        const editorContent = $(this).html();
        if(editorContent === '') {
            $(this).html('<p></p>');
        }
    });

    // 포커스 이벤트 관리
    editor.on('focus', function() {
        const placeholder = $(this).find('.placeholder');
        if (placeholder.length > 0) {
            placeholder.remove();
            $(this).html('<p></p>');
        }
    }).on('blur', function() {
        const editorContent = $(this).html().trim();
        if(editorContent === '<p></p>' || editorContent === '<p><br></p>') {
            $(this).find('p').attr('class', 'placeholder').text('글을 작성해주세요.').focus();
        }
    });


    $('#imageButton').on('click', function() {
        imageUpload.click();
    });

    // 이미지 파일 선택 시
    $('#imageUpload').on('change', function() {
        const file = this.files[0];
        if (file) {
            uploadImage(file);
            // 인풋 초기화
            $(this).val('');
        }
    });

    // 이미지 업로드 함수
    function uploadImage(file) {
        var data = new FormData();
        data.append('image', file);

        saveImage(
            data,
            (response) => {
                const url = response.url;
                // 이미지 넣기
                insertImage(createImageElement(url));
                // 업로드된 이미지 URL 배열에 추가
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

                // 추가된 이미지 요소를 찾아서 그 다음에 커서를 위치
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
})