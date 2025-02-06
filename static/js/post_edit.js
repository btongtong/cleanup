import { errorMsg } from "./error_message.js";

$(document).ready(function () {
    var uploadedImages = [];  // 업로드된 이미지 URL을 저장하는 배열
    // 이미 작성된 이미지 담기
    $('.editor img').each(function() {
        uploadedImages.push($(this).attr('src'));
    });
    const pid = window.location.pathname.split('/')[2];

    // 게시글 수정 로직
    $('#editSubmitBtn').click(function () {
        var title = $('textarea.title').val().trim();
        var content = $('.editor').html().trim();

        // 필수 입력 필드가 비어 있는지 확인
        if (title === '' || content === '<p class="placeholder">내용을 입력하세요.</p>') {
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
                deleteImage(imageUrl);
            }
        });

        $.ajax({
            type: 'PUT',
            url: '/posts/' + pid + '/edit',
            data: { 
                title: title,
                content: content
            },
            success: function (response) {
                if(response.success) {
                    window.location.href = '/posts/' + pid;
                } else {
                    alert(errorMsg.postModifyError);
                }
            },
            error: function () {
                alert(errorMsg.postModifyError);
            }
        });
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
            $(this).find('p').attr('class', 'placeholder').text('내용을 입력하세요.').focus();
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
        var formData = new FormData();
        formData.append('image', file);

        $.ajax({
            type: 'POST',
            url: '/file/upload',  // 이미지 업로드 처리를 담당하는 Flask 라우트 URL
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                if (response.success) {
                    console.log("success");
                    var imageUrl = response.url;
                    var imageHtml = '<img src="' + imageUrl + '"/>';
                    // 이미지 넣기
                    insertImage(imageHtml);
                    // 업로드된 이미지 URL 배열에 추가
                    uploadedImages.push(imageUrl);
                } else {
                    alert(errorMsg.imageUploadError);
                }
            },
            error: function() {
                alert(errorMsg.imageUploadError);
            }
        });
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

    function deleteImage(file_url){
        $.ajax({
            type: 'DELETE',
            url: `/file/${encodeURIComponent(file_url)}/delete`,
            success: function(response) {
                if (response.success) {
                    // 삭제 성공 처리
                } else {
                    alert(errorMsg.imageDeleteError);
                }
            },
            error: function() {
                alert(errorMsg.imageDeleteError);
            }
        });
    }
});
