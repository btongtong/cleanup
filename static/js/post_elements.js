function createNoContentElement() {
    return '<p class="placeholder">글을 작성해주세요.</p>';
}

function createImageElement(url) {
    return $(`
        <img src="${url}"/>
    `)
}

export { createNoContentElement, createImageElement }