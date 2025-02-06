// 날짜 형식 변환 함수
function formatDatetime(datetime) {
    const [date, time] = datetime.split('T');
    return `${date} ${time.substring(0, 5)}`;
}

export { formatDatetime }