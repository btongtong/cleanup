$(document).ready(function () {
    $('.post-write-btn').click(function () {
        window.location.href = '/post/new';
    })

    $('.search-btn').click(function () {
        var searchWord = $('.search-input').val();
        window.location.href = '/posts?title='+searchWord;
    })
})