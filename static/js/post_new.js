$(document).ready(function () {
    $('#postSubmit').click(function () {
        var title = $('textarea.title').val();
        var content = $('.content').val();
        var username = $('#username').val();
        var password = $('#password').val();

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
                    alert('success.');
                    window.location.href = '/posts/' + response.pid;
                } else {
                    alert('Failed to create post. check if you fill all blank');
                }
            },
            error: function () {
                alert('Failed to create post. Please try again later.');
            }
        });
    });
})