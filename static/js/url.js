export const url = {
    getPosts: () => `/posts`,
    getSearchPosts: (searchWord) => `/posts?title=${searchWord}`,
    getPost: (pid) => `/posts/${pid}`,
    savePost: () => `/post/new`,
    modifyPost: (pid) => `/posts/${pid}/edit`,
    deletePost: (pid) => `/posts/${pid}/delete`,
    checkPostPassword: (pid) => `/posts/${pid}/check-password`,
    getComments: (pid) => `/posts/${pid}/comments`,
    saveComment: (pid) => `/posts/${pid}/comments/new`,
    modifyComment: (pid, cid) => `/posts/${pid}/comments/${cid}/edit`,
    deleteComment: (pid, cid) => `/posts/${pid}/comments/${cid}/delete`,
    checkCommentPassword: (pid, cid) => `/posts/${pid}/comments/${cid}/check-password`,
    saveFile: () => `/file/upload`,
    deleteFile: (url) => `/file/${url}/delete`
}