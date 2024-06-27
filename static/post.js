$(document).ready(function () {
    $('#deletePost').click(function () {
        $('.confirm-box').show();
    });

    $('#updatePost').click(function () {
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
                    window.location.href = '/posts/' + pid + '/edit';
                } else {
                    alert('Password is not correct');
                }
            },
            error: function () {
                alert('Failed to check password. Please try again later.');
            }
        });
    });

})