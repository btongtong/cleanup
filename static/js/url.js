export const url = {
    getPosts: () => "",
    getPost: () => "",
    savePost: () => "",
    modifyPost: () => "",
    checkPostPassword: (pid) => ``,
    getComments: (pid) => `/posts/${pid}/comments`,
    saveComment: (pid) => `/posts/${pid}/comments/new`,
    modifyComment: (pid, cid) => `/posts/${pid}/comments/${cid}/edit`,
    deleteComment: (pid, cid) => `/posts/${pid}/comments/${cid}/delete`,
    checkCommentPassword: (pid, cid) => `/posts/${pid}/comments/${cid}/check-password`
}