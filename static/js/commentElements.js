import { formatDatetime } from "./datetime.js";

function createCommentElement(key, comment) {
    return $(`
        <li data-key="${key}">
            <div class="comment-list-top">
                <div class="comment-writer-datetime-box">
                    <p class="writer">${comment.username}</p>
                    <p class="datetime">${formatDatetime(comment.datetime)}</p>
                </div>
                <div class="comment-menu-btn">
                    <div class="comment-menu-icon">
                        <i class="fa-solid fa-ellipsis-vertical"></i>
                    </div>
                    <div class="comment-btn-container">
                        <button class="update-comment">수정</button>
                        <button class="delete-comment">삭제</button>
                    </div>
                </div>
            </div>
            <div class="comment-content">${comment.comment}</div>
        </li>
    `);
}

function createEditCommentElement(key, comment) {
    return $(`
        <li data-key="${key}" class="edit-comment">
            <div class="comment-list-top">
                <div class="comment-writer-datetime-box">
                    <p class="writer">${comment.username}</p>
                    <p class="datetime">${formatDatetime(comment.datetime)}</p>
                </div>
            </div>
            <div class="edit-comment-content-box">
                <textarea>${comment.comment}</textarea>
                <button class="comment-confirm">수정</button>
            </div>
        </li>
    `);
}

function createNoCommentElement() {
    return $(`
        <li>댓글이 없습니다.</li>
    `);
}

export { createCommentElement, createEditCommentElement, createNoCommentElement }