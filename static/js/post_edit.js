$(document).ready(function () {
    const pid = window.location.pathname.split('/')[2];
    $('#editSubmitBtn').click(function () {
        var title = $('textarea.title').val();
        var content = $('.content').val();

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
                    alert('Failed to create post. check if you fill all blank');
                }
            },
            error: function () {
                alert('Failed to create post. Please try again later.');
            }
        });
    });
})