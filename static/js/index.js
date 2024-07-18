$(document).ready(function () {

    // 맞춤법 검사
    $('#grammar').click(function () {
        var text = $('#inputText').val();

        $('#outputText').html('<strong>맞춤법 검사를 진행하고 있습니다.</strong>');
        $.ajax({
            type: 'POST',
            url: '/check-spell',
            data: { text: text },
            success: function (response) {
                if (response.success) {
                    var data = response.data;

                    var correctedText = text;
                    var offset = 0; // 교정에 따라 인덱스를 조정하기 위한 오프셋

                    data.forEach(function (error) {
                        var orgStr = error['orgStr'];
                        var candWord = error['candWord'];
                        var start = error['start'] + offset;
                        var end = error['end'] + offset;

                        if (candWord == '') return;

                        // 교정된 문자열 생성
                        var originalLength = end - start;
                        var replacement = '<span class="origin">' + orgStr + '</span>' +
                            '<span class="highlight">' + candWord + '</span>';
                        var replacementLength = replacement.length;

                        // 교정된 텍스트로 대체
                        correctedText = correctedText.substring(0, start) +
                            replacement +
                            correctedText.substring(end);

                        // 인덱스 오프셋 업데이트
                        offset += replacementLength - originalLength;
                    });

                    $('#outputText').html(correctedText.replace(/\n/g, '<br>'));
                } else {
                    alert('맞춤법 교정에 실패하였습니다.');
                }
            },
            error: function () {
                $('#outputText').text('');
                alert('맞춤법 교정에 실패하였습니다. 다음에 다시 시도해주세요.');
            }
        });
    });

    // 특수문자 변환 및 원본 <span> 태그로 감싸기
    function replaceAndHighlight(text, replacements) {
        replacements.forEach(([searchValue, newValue]) => {
            text = text.split(searchValue)
                .join('<span class="origin">' + searchValue + '</span><span class="highlight">' + newValue + '</span>');
        });
        return text;
    }

    $('#combination').click(function () {
        var text = $('#inputText').val();
        var replacements = [
            ['〜', '~'],
            ['，', ','],
            ['！', '!'],
            ['：', ':'],
            ['；', ';'],
            ['···', '…'],
            ['...', '…'],
            ['•••', '…'],
            ['（', '('],
            ['）', ')'],
            ['［', '['],
            ['］', ']']
        ];

        text = replaceAndHighlight(text, replacements);
        text = text.replace(/\n/g, '<br>');

        $('#outputText').html(text);
    });

    // (<>) 변환
    $('#triangleBracket').click(function () {
        var text = $('#inputText').val();
        var newText = text.replace(/</g, '〈change').replace(/>/g, '〉change').replace(/〈change/g, '<span class="origin">&lt;</span><span class="highlight">〈</span>').replace(/〉change/g, '<span class="origin">&gt;</span><span class="highlight">〉</span>');
        $('#outputText').html(newText.replace(/\n/g, '<br>'));
    });

    // (《》) 변환
    $('#doubleTriangleBracket').click(function () {
        var text = $('#inputText').val();
        var newText = text.replace(/<</g, '《change').replace(/>>/g, '》change').replace(/《change/g, '<span class="origin">&lt;&lt;</span><span class="highlight">《</span>').replace(/》change/g, '<span class="origin">&gt;&gt;</span><span class="highlight">》</span>');
        $('#outputText').html(newText.replace(/\n/g, '<br>'));
    });

    // (“”) 변환
    $('#quote').click(function () {
        var text = $('#inputText').val();
        let result = '';
        let inQuote = false;

        for (let i = 0; i < text.length; i++) {
            if (text[i] === '“') {
                result += text[i];
                inQuote = true;
            } else if (text[i] === '”') {
                result += text[i];
                inQuote = false;
            } else if (text[i] === '"') {
                result += '<span class="origin">' + text[i] + '</span>';
                result += (inQuote) ? '<span class="highlight">”</span>' : '<span class="highlight">“</span>';
                inQuote = !inQuote;
            } else {
                result += text[i];
            }
        }
        $('#outputText').html(result.replace(/\n/g, '<br>'));
    });

    // (‘’) 변환
    $('#smallQuote').click(function () {
        var text = $('#inputText').val();
        let result = '';
        let inQuote = false;

        for (let i = 0; i < text.length; i++) {
            if (text[i] === '‘') {
                result += text[i];
                inQuote = true;
            } else if (text[i] === '’') {
                if (i !== 0 && i != text.length - 1 && /[a-zA-Z]/.test(text[i - 1]) && /[a-zA-Z]/.test(text[i + 1])) {
                    result += '<span class="origin">' + text[i] + '</span>';
                    result += '<span class="highlight">&#39;</span>';
                } else {
                    result += text[i];
                    inQuote = false;
                }
            } else if (text[i] === '\'') {
                result += '<span class="origin">' + text[i] + '</span>';

                if (i !== 0 && i != text.length - 1 && /[a-zA-Z]/.test(text[i - 1]) && /[a-zA-Z]/.test(text[i + 1])) {
                    result += '<span class="highlight">&#39;</span>';
                } else {
                    result += (inQuote) ? '<span class="highlight">’</span>' : '<span class="highlight">‘</span>';
                    inQuote = !inQuote;
                }
            } else {
                result += text[i];
            }
        }
        $('#outputText').html(result.replace(/\n/g, '<br>'));
    });

    // (「」) 변환
    $('#cornerBracket').click(function () {
        var text = $('#inputText').val();
        var result = text.replace(/(?<![a-zA-Z])([r厂■])(?![a-zA-Z])/g, function (match) {
            return '<span class="origin">' + match + '</span><span class="highlight">「</span>';
        }).replace(/(?<![a-zA-Z])([Jj丄□])(?![a-zA-Z])/g, function (match) {
            return '<span class="origin">' + match + '</span><span class="highlight">」</span>';
        });
        $('#outputText').html(result.replace(/\n/g, '<br>'));
    });

    // (『』) 변환
    $('#doubleCornerBracket').click(function () {
        var text = $('#inputText').val();
        var result = text.replace(/(?<![a-zA-Z])([r厂■「])(?![a-zA-Z])/g, function (match) {
            return '<span class="origin">' + match + '</span><span class="highlight">『</span>';
        }).replace(/(?<![a-zA-Z])([Jj丄□」])(?![a-zA-Z])/g, function (match) {
            return '<span class="origin">' + match + '</span><span class="highlight">』</span>';
        });
        $('#outputText').html(result.replace(/\n/g, '<br>'));
    });


    // 드래그 한 부분을 감싸는 지정 괄호 변환 함수
    function wrapTextWithBrackets(leftBracket, rightBracket) {
        var textarea = $('#inputText')[0];
        var start = textarea.selectionStart;
        var end = textarea.selectionEnd;

        if (start !== end) {
            var text = textarea.value;
            var selectedText = text.substring(start, end);
            var newText = text.substring(0, start) + '<span class="origin">' + selectedText + '</span><span class="highlight">' + leftBracket + selectedText + rightBracket + '</span>' + text.substring(end);
            $('#outputText').html(newText.replace(/\n/g, '<br>'));
        } else {
            alert('원하는 부분을 먼저 드래그해주세요.');
        }
    }

    $('#wrapBracket').click(function () {
        wrapTextWithBrackets('(', ')');
    });

    $('#wrapSmallQuoteBracket').click(function () {
        wrapTextWithBrackets('‘', '’');
    });

    $('#wrapQuoteBracket').click(function () {
        wrapTextWithBrackets('“', '”');
    });

    $('#wrapTriangleBracket').click(function () {
        wrapTextWithBrackets('〈', '〉');
    });

    $('#wrapDoubleTriangleBracket').click(function () {
        wrapTextWithBrackets('《', '》');
    });

    $('#wrapCornerBracket').click(function () {
        wrapTextWithBrackets('「', '」');
    });

    $('#wrapDoubleCornerBracket').click(function () {
        wrapTextWithBrackets('『', '』');
    });

    // 하이라이트 부분 클릭 -> 원본 가져오기
    $('#outputText').on('click', '.highlight', function () {
        $(this).hide();
        $(this).prev('.origin').show();
    });

    // 원본 클릭 -> 하이라이트 부분 가져오기
    $('#outputText').on('click', '.origin', function () {
        $(this).hide();
        $(this).next('.highlight').show();
    });

    // 사용자에게 보여지는 부분만 글자 가져오기
    function getVisibleText(element) {
        return $(element).contents().filter(function () {
            return this.nodeType === Node.TEXT_NODE || $(this).is(':visible');
        }).map(function () {
            if (this.nodeType === Node.TEXT_NODE) {
                return this.nodeValue;
            } else if ($(this).is('br')) {
                return '\n';
            } else {
                return $(this).text();
            }
        }).get().join('');
    }

    // 복사
    $('#copy').click(function () {
        var visibleText = getVisibleText($('#outputText'));
        navigator.clipboard.writeText(visibleText).then(function () {
            $('#copy').hide();
            $('.copy-confirm').css('display', 'flex');  // 태그 보이기
            setTimeout(function () {
                $('.copy-confirm').hide();  // 3초 후 태그 숨기기
                $('#copy').css('display', 'flex');
            }, 2000);
        }).catch(function (err) {

        });
    });

    // 붙여넣기
    $('#paste').click(function () {
        navigator.clipboard.readText().then(function (text) {
            $('#inputText').val(text);
            $('#paste').hide();
            $('.paste-confirm').css('display', 'flex');  // 태그 보이기
            setTimeout(function () {
                $('.paste-confirm').hide();  // 3초 후 태그 숨기기
                $('#paste').css('display', 'flex');
            }, 2000);
        }).catch(function (err) {

        });
    });
});