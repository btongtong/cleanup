$(document).ready(function () {
    // pid 주소줄에서 가져오기
    const pid = window.location.pathname.split('/')[2];
    let action = '';

    // 댓글 리스트
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
                                .append(
                                    $("<div>").addClass("comment-list-top")
                                        .append(
                                            $("<div>").addClass("comment-writer-datetime-box")
                                                .append($("<p>").addClass("writer").text(comment.username))
                                                .append($("<p>").addClass("datetime").text(comment.datetime.split('T')[0] + " " + comment.datetime.split('T')[1].substring(0, 5)))
                                        )
                                        .append(
                                            $("<div>").addClass("comment-menu-btn")
                                                .append(
                                                    $("<div>").addClass("comment-menu-icon")
                                                        .append($("<i>").addClass("fa-solid fa-ellipsis-vertical"))
                                                )
                                                .append(
                                                    $("<div>").addClass("comment-btn-container")
                                                        .append($("<button>").addClass("update-comment").text("수정"))
                                                        .append($("<button>").addClass("delete-comment").text("삭제"))
                                                )
                                        )
                                )
                                .append(
                                    $("<div>").addClass("comment-content").text(comment.comment)
                                );
        
                            const commentEditItem = $("<li>")
                                .attr("data-key", key)
                                .addClass("edit-comment")
                                .append(
                                    $("<div>").addClass("comment-list-top")
                                        .append(
                                            $("<div>").addClass("comment-writer-datetime-box")
                                                .append($("<p>").addClass("writer").text(comment.username))
                                                .append($("<p>").addClass("datetime").text(comment.datetime))
                                        )
                                )
                                .append(
                                    $("<div>").addClass("edit-comment-content-box")
                                        .append($("<textarea>").addClass("edit-commnet").text(comment.comment))
                                        .append($("<button>").addClass("comment-confirm").text("수정"))
                                );
        
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

    // 댓글 작성 클릭 로직
    $('.comment-submit').click(function () {
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

        $('#comment').val(''); 
        $('#cUsername').val('');
        $('#cPassword').val(''); 
    })

    // 게시물 삭제 비밀번호 인증 창 띄우기
    $('#deletePost').click(function () {
        action = 'delete';
        $('.overlay').show();
        $('.post.confirm-box').css('display', 'flex');
    });

    // 게시물 수정 비밀번호 인증 창 띄우기
    $('#updatePost').click(function () {
        action = 'update';
        $('.overlay').show();
        $('.post.confirm-box').css('display', 'flex');
    });

    // 댓글 삭제 비밀번호 인증 창 띄우기
    $(document).on('click', '.delete-comment', function () {
        const cid = $(this).closest('li').attr('data-key');
        action = 'delete';
        $('.overlay').show();
        $('.comment.confirm-box').data('cid', cid).css('display', 'flex');
    });
    
    //  댓글 수정 비밀번호 인증 창 띄우기
    $(document).on('click', '.update-comment', function () {
        const cid = $(this).closest('li').attr('data-key');
        action = 'update';
        $('.overlay').show();
        $('.comment.confirm-box').data('cid', cid).css('display', 'flex');
    });

    // 비밀번호 인증 박스 뒤로가기 버튼 클릭
    $('.back').click(function () {
        $('#password').val('');
        $('#commentPassword').val('');
        $('.overlay').hide();
        $('.confirm-box').hide();
        $('.comment.confirm-box').hide();
    })

    // 게시글 비밀번호 인증 확인 클릭
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

        $('.back').click();
    });

    // 게시글 삭제 로직
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
        $('.back').click();
    }

    // 댓글 비밀번호 인증 클릭
    $('#commentPasswordSubmit').click(function () {
        const cid = $('.comment.confirm-box').data('cid');
        var password = $('#commentPassword').val();
        $('.comment.confirm-box').hide();
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

                        $('.edit-comment textarea').focus();
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
        $('.back').click();
    });

    // 댓글 삭제 로직
    function deleteComment(pid, cid) {
        $.ajax({
            type: 'DELETE',
            url: '/posts/' + pid + '/comments/' + cid + '/delete',
            success: function (response) {
                if(response.success) {
                    alert("success");
                    loadComments();
                } else {
                    alert('Failed to delete comment.');
                }
            },
            error: function () {
                alert('Failed to delete comment. Please try again later.');
            }
        });
        $('.back').click();
    }

    // 댓글 수정 로직
    $(document).on('click', '.comment-confirm', function () {
        const cid = $(this).closest('li.edit-comment').data('key');
        var comment = $('.edit-commnet').val();

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

    // 게시글 목록 가기 버튼 클릭
    $('.get-posts-btn').click(function () {
        window.location.href = '/posts';
    })

    // 게시글 삭제, 수정 버튼 창 띄우기
    $('#menuIcon, #menuIcon i').click(function (event) {
        event.stopPropagation();
        $('.btn-container').show();
    })

    // 댓글 삭제, 수정 버튼 창 띄우기
    $(document).on('click', '.comment-menu-icon, .comment-menu-icon i', function (event) {
        event.stopPropagation();
        $('.btn-container, .comment-btn-container').hide();
        $(this).closest('li').find('.comment-btn-container').show();
    });    

    // 삭제, 수정 버튼 창 지우기
    $(document).click(function(event) {
        $('.btn-container, .comment-btn-container').hide();
    });
})