$(document).ready(function () {
    const pid = $('#pid').val();
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
                            const commentItem = $("<li>").text(comment.comment);
                            commentList.append(commentItem);
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
        var password = $('#cPassword').val(); 

        $.ajax({
            type: 'POST',
            url: '/posts/'+ pid +'/comments/new',
            data: { 
                comment: comment,
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

    $('#back').click(function () {
        $('.confirm-box').hide();
    })

    $('#submit').click(function () {
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
                alert('Failed tto delete password. Please try again later.');
            }
        });
    }

})