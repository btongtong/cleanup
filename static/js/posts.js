import { url } from "./url.js";

$(document).ready(function () {
    // 댓글 작성 버튼 클릭
    $('.post-write-btn').click(function () {
        window.location.href = url.savePost();
    })

    // 검색 버튼 클릭
    $('.search-btn').click(function () {
        var searchWord = $('.search-input').val();
        window.location.href = url.getSearchPosts(searchWord);
    })

    const paginationDivs = document.querySelectorAll('.pagination .prev, .pagination .next, .pagination .number-box div');

    // 페이지네이션
    paginationDivs.forEach(div => {
        div.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            const title = new URLSearchParams(window.location.search).get('title');
            const queryString = title ? `?title=${title}&page=${page}` : `?page=${page}`;
            window.location.href = `/posts${queryString}`;
        });
    });
})