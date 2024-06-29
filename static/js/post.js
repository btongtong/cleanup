$(document).ready(function () {
    const pid = window.location.pathname.split('/')[2];
    let action = '';

    function loadComments() {
        $.ajax({
            type: 'GET',
            url: '/posts/' + pid + '/comments',
            success: function(response) {
                if (response.success) {
                    const commentsObj = response.data;
                    const commentList = $("#commentList");
                    commentList.empty(); // 존재하는 댓글들 지우기

                    if (commentsObj) {
                        Object.keys(commentsObj).forEach(function(key) {
                            const comment = commentsObj[key];
                            const commentItem = $("<li>")
                                .attr("data-key", key)
                                .append($("<div>").text(comment.comment))
                                .append($("<div>").text(comment.datetime))
                                .append($("<button>").attr("class", "update-comment").text("수정"))
                                .append($("<button>").attr("class", "delete-comment").text("삭제"));

                            const commentEditItem = $("<li>")
                                .attr("data-key", key)
                                .attr("class", "edit-comment")
                                .append($("<textarea>").attr("id", "editComment").text(comment.comment))
                                .append($("<div>").text(comment.datetime))
                                .append($("<button>").attr("id", "commentConfirm").text("확인"));
                            commentList.append(commentItem).append(commentEditItem);
                        });
                    } else {
                        commentList.append("<li>No comments yet.</li>");
                    }
                } else {
                    alert("Failed to load comments.");
                }
            },
            error: function () {
                alert('Failed to load comments. Please try again later.');
            }
        });
    }

    loadComments();

    $('#comment-submit').click(function () {
        var comment = $('#comment').val(); 
        var username = $('#cUsername').val();
        var password = $('#cPassword').val(); 

        $.ajax({
            type: 'POST',
            url: '/posts/'+ pid +'/comments/new',
            data: { 
                comment: comment,
                username: username,
                password: password
            },
            success: function (response) {
                if(response.success) {
                    loadComments();
                } else {
                    alert('Failed to post comment.');
                }
            },
            error: function () {
                alert('Failed to post comment. Please try again later.');
            }
        });
    })

    $('#deletePost').click(function () {
        action = 'delete';
        $('.confirm-box').show();
    });

    $('#updatePost').click(function () {
        action = 'update';
        $('.confirm-box').show();
    });

    $(document).on('click', '.delete-comment', function () {
        const cid = $(this).closest('li').attr('data-key');
        action = 'delete';
        $('.comment-confirm-box').data('cid', cid).show();
    });
    
    $(document).on('click', '.update-comment', function () {
        const cid = $(this).closest('li').attr('data-key');
        action = 'update';
        $('.comment-confirm-box').data('cid', cid).show();
    });

    $('.back').click(function () {
        $('#password').val('');
        $('#commentPassword').val('');
        $('.confirm-box').hide();
        $('.comment-confirm-box').hide();
    })

    $('#postPasswordSubmit').click(function () {
        var password = $('#password').val();

        $.ajax({
            type: 'POST',
            url: '/posts/'+ pid +'/check-password',
            data: { 
                password: password
            },
            success: function (response) {
                if(response.success) {
                    if(action === 'update') {
                        window.location.href = '/posts/' + pid + '/edit';
                    } else {
                        deletePost(pid);
                    }
                } else {
                    alert('Password is not correct');
                }
            },
            error: function () {
                alert('Failed to check password. Please try again later.');
            }
        });
    });

    function deletePost (pid) {
        $.ajax({
            type: 'DELETE',
            url: '/posts/'+ pid +'/delete',
            success: function (response) {
                if(response.success) {
                    window.location.href = '/posts';
                } else {
                    alert('Failed to delete password');
                }
            },
            error: function () {
                alert('Failed to delete password. Please try again later.');
            }
        });
    }

    // 댓글 삭제 or 수정 버튼 클릭 이벤트 핸들러 등록
    $('#commentPasswordSubmit').click(function () {
        const cid = $('.comment-confirm-box').data('cid');
        var password = $('#commentPassword').val();
        $('.comment-confirm-box').hide();
        $('#commentPassword').val('');

        $.ajax({
            type: 'POST',
            url: '/posts/' + pid + '/comments/' + cid + '/check-password',
            data: { 
                password: password
            },
            success: function (response) {

                if(response.success) {
                    if(action === 'update') {
                        $(`#commentList li[data-key="${cid}"].edit-comment`).show();
                        $(`#commentList li[data-key="${cid}"]:not(.edit-comment)`).hide();
                    } else {
                        deleteComment(pid, cid);
                    }
                } else {
                    alert('Fail to check password.');
                }
            },
            error: function () {
                alert('Failed to check password. Please try again later.');
            }
        });
    });

    function deleteComment(pid, cid) {
        $.ajax({
            type: 'DELETE',
            url: '/posts/' + pid + '/comments/' + cid + '/delete',
            success: function (response) {
                if(response.success) {
                    loadComments();
                } else {
                    alert('Failed to delete comment.');
                }
            },
            error: function () {
                alert('Failed to delete comment. Please try again later.');
            }
        });
    }

    $(document).on('click', '#commentConfirm', function () {
        const cid = $(this).closest('li.edit-comment').data('key');
        var comment = $('#editComment').val();

        $.ajax({
            type: 'PUT',
            url: '/posts/' + pid + '/comments/' + cid + '/edit',
            data: { 
                comment: comment
            },
            success: function (response) {

                if(response.success) {
                    loadComments();
                } else {
                    alert('Fail to edit password.');
                }
            },
            error: function () {
                alert('Failed to edit comment. Please try again later.');
            }
        });
    })
})