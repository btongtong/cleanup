import { errorMsg } from "./error_message.js";
import { isValidPassword } from "./password.js";
import { getComments, saveComment, checkCommentPassword, modifyComment, deleteComment } from "./comment_api.js";
import { createCommentElement, createEditCommentElement, createNoCommentElement } from "./commentElements.js";

$(document).ready(function () {
    // pid 주소줄에서 가져오기
    const pid = window.location.pathname.split('/')[2];
    // 삭제, 수정 판단할 변수
    let action = '';

    // 댓글 리스트 가져오기
    function getCommentList () {
        getComments(pid,
            (response) => {
                const commentList = $("#commentList");
                commentList.empty();
    
                if (response.data.length > 0) {
                    response.data.forEach(([key, comment]) => {
                        commentList.append(createCommentElement(key, comment))
                                .append(createEditCommentElement(key, comment));
                    });
                } else {
                    commentList.append(createNoCommentElement());
                }
            },
            (response) => alert(errorMsg.commentGetError)
        );
    }

    getCommentList();

    // 댓글 작성 클릭 로직
    $('.comment-submit').click(function () {
        const comment = $('#comment').val().trim();
        const username = $('#cUsername').val().trim();
        const password = $('#cPassword').val().trim();

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

        saveComment(pid, 
            { comment: comment, username: username, password: password }, 
            getCommentList,
            (response) =>  alert(errorMsg.commentSaveError)
        );

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
        const password = $('#commentPassword').val();
        $('.comment.confirm-box').hide();
        $('#commentPassword').val('');

        checkCommentPassword(
            pid, 
            cid, 
            {password: password}, 
            (response) => {
                if (action === 'update') {
                    $(`#commentList li[data-key="${cid}"].edit-comment`).show();
                    $(`#commentList li[data-key="${cid}"]:not(.edit-comment)`).hide();

                    $('.edit-comment-content-box textarea').focus();
                } else {
                    removeComment(pid, cid);
                }
            },
            (response) => alert(errorMsg.passwordWrongError)
        );

        $('.back').click();
    });

    // 댓글 삭제 로직
    function removeComment(pid, cid) {
        deleteComment(
            pid,
            cid,
            getCommentList,
            (response) => alert(errorMsg.commentDeleteError)
        );
        
        $('.back').click();
    }

    // 댓글 수정 로직
    $(document).on('click', '.comment-confirm', function () {
        const cid = $(this).closest('li.edit-comment').data('key');
        var comment = $('.edit-comment-content-box textarea').val().trim();

        // 필수 입력 필드가 비어 있는지 확인
        if (comment === '') {
            alert(errorMsg.fillOutError); 
            return;  
        }

        modifyComment(
            pid, 
            cid, 
            {comment: comment},
            getCommentList,
            (response) => alert(errorMsg.commentModifyError)
        );
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