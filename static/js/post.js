import { errorMsg } from "./error_message.js";
import { isValidPassword } from "./password.js";

$(document).ready(function () {
    // pid 주소줄에서 가져오기
    const pid = window.location.pathname.split('/')[2];
    // 삭제, 수정 판단할 변수
    let action = '';

    // 댓글 리스트
    function loadComments() {
        $.ajax({
            type: 'GET',
            url: '/posts/' + pid + '/comments',
            success: function (response) {
                if (response.success) {
                    const commentsArray = response.data;
                    const commentList = $("#commentList");
                    commentList.empty(); // 존재하는 댓글들 지우기

                    // 댓글 리스트
                    commentsArray.forEach(function ([key, comment]) {
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

                        // 댓글 수정 리스트
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
                    commentList.append("<li>댓글이 없습니다.</li>");
                }
            },
            error: function () {
                alert(errorMsg.commentGetError);
            }
        });
    }

    loadComments();

    // 댓글 작성 클릭 로직
    $('.comment-submit').click(function () {
        var comment = $('#comment').val().trim();
        var username = $('#cUsername').val().trim()
        var password = $('#cPassword').val().trim()

        // 필수 입력 필드가 비어 있는지 확인
        if (comment === '' || username === '' || password === '') {
            alert(errorMsg.fillOutError); 
            return;  
        }

        // 비밀번호 유효성 검사
        if (!isValidPassword(password)) {
            alert(errorMsg.passwordFormatError);
            return;
        }

        $.ajax({
            type: 'POST',
            url: '/posts/' + pid + '/comments/new',
            data: {
                comment: comment,
                username: username,
                password: password
            },
            success: function (response) {
                if (response.success) {
                    loadComments();
                } else {
                    alert(errorMsg.commentSaveError);
                }
            },
            error: function () {
                alert(errorMsg.commentSaveError);
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

    // 게시글 비밀번호 인증
    $('#postPasswordSubmit').click(function () {
        var password = $('#password').val();

        $.ajax({
            type: 'POST',
            url: '/posts/' + pid + '/check-password',
            data: {
                password: password
            },
            success: function (response) {
                if (response.success) {
                    if (action === 'update') {
                        window.location.href = '/posts/' + pid + '/edit';
                    } else {
                        deletePost(pid);
                    }
                } else {
                    alert(errorMsg.passwordWrongError);
                }
            },
            error: function () {
                alert(errorMsg.passwordWrongError);
            }
        });

        $('.back').click();
    });

    // 게시글 삭제 로직
    function deletePost(pid) {
        $.ajax({
            type: 'DELETE',
            url: '/posts/' + pid + '/delete',
            success: function (response) {
                if (response.success) {
                    alert('게시글 삭제 완료.');
                    window.location.href = '/posts';
                } else {
                    alert(errorMsg.postDeleteError);
                }
            },
            error: function () {
                alert(errorMsg.postDeleteError);
            }
        });
        $('.back').click();
    }

    // 댓글 비밀번호 인증 
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

                if (response.success) {
                    if (action === 'update') {
                        $(`#commentList li[data-key="${cid}"].edit-comment`).show();
                        $(`#commentList li[data-key="${cid}"]:not(.edit-comment)`).hide();

                        $('.edit-comment textarea').focus();
                    } else {
                        deleteComment(pid, cid);
                    }
                } else {
                    alert(errorMsg.passwordWrongError);
                }
            },
            error: function () {
                alert(errorMsg.passwordWrongError);
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
                if (response.success) {
                    loadComments();
                    alert("댓글 삭제 완료.");
                } else {
                    alert(errorMsg.commentDeleteError);
                }
            },
            error: function () {
                alert(errorMsg.commentDeleteError);
            }
        });
        $('.back').click();
    }

    // 댓글 수정 로직
    $(document).on('click', '.comment-confirm', function () {
        const cid = $(this).closest('li.edit-comment').data('key');
        var comment = $('.edit-commnet').val().trim();

        // 필수 입력 필드가 비어 있는지 확인
        if (comment === '') {
            alert(errorMsg.fillOutError); 
            return;  
        }

        $.ajax({
            type: 'PUT',
            url: '/posts/' + pid + '/comments/' + cid + '/edit',
            data: {
                comment: comment
            },
            success: function (response) {
                if (response.success) {
                    loadComments();
                } else {
                    alert(errorMsg.commentModifyError);
                }
            },
            error: function () {
                alert(errorMsg.commentModifyError);
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
    $(document).click(function (event) {
        $('.btn-container, .comment-btn-container').hide();
    });
})