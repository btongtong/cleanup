import { errorMsg } from "./error_message.js";

// 비밀번호 유효성 검사 함수
function isValidPassword(password) {
    // 최소 6글자, 숫자 포함 여부, 문자 포함 여부
    var regex = /^(?=.*[0-9])(?=.*[a-zA-Z]).{6,}$/;
    return regex.test(password);
}

export { isValidPassword }