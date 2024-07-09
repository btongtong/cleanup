$(document).ready(function () {
    // 게시글 등록 로직
    $('#postSubmit').click(function () {
        var title = $('textarea.title').val().trim();  // trim()을 사용하여 양쪽 공백 제거
        var content = $('.content').val().trim();
        var username = $('#username').val().trim();
        var password = $('#password').val().trim();

        // 필수 입력 필드가 비어 있는지 확인
        if (title === '' || content === '' || username === '' || password === '') {
            alert('모든 항목을 작성해주세요.'); 
            return;  
        }

        // 비밀번호 유효성 검사
        if (!isValidPassword(password)) {
            alert('비밀번호는 문자와 숫자의 조합이며, 최소 6글자 이상이어야 합니다.');
            return;
        }

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
})