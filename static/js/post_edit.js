$(document).ready(function () {
    const pid = window.location.pathname.split('/')[2];
    $('#editSubmitBtn').click(function () {
        var title = $('textarea.title').val().trim();
        var content = $('.content').val().trim();

        if(title === '' || content === '') {
            alert('모든 항목을 작성해주세요.');
            return;
        }

        $.ajax({
            type: 'PUT',
            url: '/posts/' + pid + '/edit',
            data: { 
                title: title,
                content: content
            },
            success: function (response) {
                if(response.success) {
                    alert('success.');
                    window.location.href = '/posts/' + pid;
                } else {
                    alert('게시글 수정에 실패하였습니다.');
                }
            },
            error: function () {
                alert('게시글 수정에 실패하였습니다. 나중에 다시 시도해주세요.');
            }
        });
    });
})