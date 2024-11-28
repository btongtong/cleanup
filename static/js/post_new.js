$(document).ready(function () {
    var uploadedImages = [];  // 업로드된 이미지 URL을 저장하는 배열

    // 게시글 등록 로직
    $('#postSubmit').click(function () {
        var title = $('textarea.title').val().trim();  // trim()을 사용하여 양쪽 공백 제거
        var content = $('.editor').html();
        var username = $('#username').val().trim();
        var password = $('#password').val().trim();

        // 필수 입력 필드가 비어 있는지 확인
        if (title === '' || content === '<p class="placeholder>글을 작성해주세요.</p>' || username === '' || password === '') {
            alert('모든 항목을 작성해주세요.'); 
            return;  
        }

        // 비밀번호 유효성 검사
        if (!isValidPassword(password)) {
            alert('비밀번호는 문자와 숫자의 조합이며, 최소 6글자 이상이어야 합니다.');
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
            type: 'POST',
            url: '/post/new',
            data: { 
                title: title, 
                content: content,
                username: username,
                password: password
            },
            success: function (response) {
                if(response.success) {
                    window.location.href = '/posts/' + response.pid;
                } else {
                    alert('게시글 작성에 실패하였습니다.');
                }
            },
            error: function () {
                alert('게시글 작성에 실패하였습니다. 나중에 다시 시도해주세요.');
            }
        });
    });

    // 비밀번호 유효성 검사 함수
    function isValidPassword(password) {
        // 최소 6글자, 숫자 포함 여부, 문자 포함 여부
        var regex = /^(?=.*[0-9])(?=.*[a-zA-Z]).{6,}$/;
        return regex.test(password);
    }

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
                    alert('이미지 업로드에 실패하였습니다.');
                }
            },
            error: function() {
                alert('이미지 업로드에 실패하였습니다. 나중에 다시 시도해주세요.');
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

    function deleteImage(file_url){
        $.ajax({
            type: 'DELETE',
            url: `/file/${encodeURIComponent(file_url)}/delete`,
            success: function(response) {
                if (response.success) {
                    
                } else {
                    alert("파일 삭제 실패.");
                }
            },
            error: function() {
                alert("파일 삭제 실패. 나중에 다시 시도해주세요.");
            }
        });
    }
})