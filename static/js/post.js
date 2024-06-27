$(document).ready(function () {
    let action = '';
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
        var pid = $('#pid').val();
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