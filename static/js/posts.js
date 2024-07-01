$(document).ready(function () {
    $('.post-write-btn').click(function () {
        window.location.href = '/post/new';
    })

    $('.search-btn').click(function () {
        var searchWord = $('.search-input').val();
        window.location.href = '/posts?title='+searchWord;
    })

    const paginationDivs = document.querySelectorAll('.pagination .prev, .pagination .next, .pagination .number-box div');

    paginationDivs.forEach(div => {
        div.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            const title = new URLSearchParams(window.location.search).get('title');
            const queryString = title ? `?title=${title}&page=${page}` : `?page=${page}`;
            window.location.href = `/posts${queryString}`;
        });
    });
})