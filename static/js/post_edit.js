import { url } from "./url.js";
import { modifyPost } from "./post_api.js";
import { errorMsg } from "./error_message.js";
import { uploadImage, removeImage } from "./file.js";
import { createNoContentElement } from "./post_elements.js";

$(document).ready(function () {
    var uploadedImages = [];  // 업로드된 이미지 URL을 저장하는 배열
    // 이미 작성된 이미지 담기
    $('.editor img').each(function() {
        uploadedImages.push($(this).attr('src'));
    });
    const pid = window.location.pathname.split('/')[2];

    // 게시글 수정 로직
    $('#editSubmitBtn').click(function () {
        const title = $('textarea.title').val().trim();
        const content = $('.editor').html().trim();

        // 필수 입력 필드가 비어 있는지 확인
        if (title === '' || content === createNoContentElement()) {
            alert(errorMsg.fillOutError);
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

        modifyPost(
            pid,
            {title: title, content: content},
            (response) => window.location.href = url.modifyPost(pid),
            (response) => alert(errorMsg.postModifyError)
        );
    });

    const editor = $('.editor');

    $('.content').on('click', function() {
        editor.focus();
    });

    // 처음 입력할 때 값이 없으면 p 추가
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
            // 업로드 이미지 저장
            uploadImage(file, uploadedImages);
            // 인풋 초기화
            $(this).val('');
        }
    });
});
