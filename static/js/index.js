$(document).ready(function () {
    function replaceAndHighlight(text, searchValue, newValue) {
        var highlightedText = text.split(searchValue).join('<span class="origin">' + searchValue + '</span><span class="highlight">' + newValue + '</span>');
        return highlightedText.replace(/\n/g, '<br>');
    }

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
                    alert('Failed to check spelling.');
                }
            },
            error: function () {
                $('#outputText').text('');
                alert('Failed to check spelling. Please try again later.');
            }
        });
    });

    $('#tilde').click(function () {
        var text = $('#inputText').val();
        $('#outputText').html(replaceAndHighlight(text, '〜', '~'));
    });

    $('#comma').click(function () {
        var text = $('#inputText').val();
        $('#outputText').html(replaceAndHighlight(text, '，', ','));
    });

    $('#exclamation').click(function () {
        var text = $('#inputText').val();
        $('#outputText').html(replaceAndHighlight(text, '！', '!'));
    });

    $('#bracket').click(function () {
        var text = $('#inputText').val();
        var newText = text.replace(/（/g, '<span class="origin">（</span><span class="highlight">(</span>').replace(/）/g, '<span class="origin">）</span><span class="highlight">)</span>');
        $('#outputText').html(newText.replace(/\n/g, '<br>'));
    });

    $('#triangleBracket').click(function () {
        var text = $('#inputText').val();
        var newText = text.replace(/</g, '〈change').replace(/>/g, '〉change').replace(/〈change/g, '<span class="origin">&lt;</span><span class="highlight">〈</span>').replace(/〉change/g, '<span class="origin">&gt;</span><span class="highlight">〉</span>');
        $('#outputText').html(newText.replace(/\n/g, '<br>'));
    });

    $('#doubleTriangleBracket').click(function () {
        var text = $('#inputText').val();
        var newText = text.replace(/<</g, '<span class="origin"><<</span><span class="highlight">《</span>').replace(/>>/g, '<span class="origin">>></span><span class="highlight">》</span>');
        $('#outputText').html(newText.replace(/\n/g, '<br>'));
    });

    $('#doubleTriangleBracket').click(function () {
        var text = $('#inputText').val();
        var newText = text.replace(/<</g, '《change').replace(/>>/g, '》change').replace(/《change/g, '<span class="origin">&lt;&lt;</span><span class="highlight">《</span>').replace(/》change/g, '<span class="origin">&gt;&gt;</span><span class="highlight">》</span>');
        $('#outputText').html(newText.replace(/\n/g, '<br>'));
    });

    $('#ellipsis').click(function () {
        var text = $('#inputText').val();
        var newText = text
            .replace(/···/g, '<span class="origin">···</span><span class="highlight">…</span>')
            .replace(/\.\.\./g, '<span class="origin">...</span><span class="highlight">…</span>')
            .replace(/•••/g, '<span class="origin">•••</span><span class="highlight">…</span>');
        $('#outputText').html(newText.replace(/\n/g, '<br>'));
    });

    $('#english').click(function () {
        var text = $('#inputText').val();
        var newText = text.replace(/\b([a-zA-Z\s,]+)\b/g, function (match) {
            return '<span class="origin">' + match.trim() + '</span><span class="highlight">(' + match.trim() + ')</span>';
        });
        $('#outputText').html(newText.replace(/\n/g, '<br>'));
    });

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

    $('#cornerBracket').click(function () {
        var text = $('#inputText').val();
        var result = text.replace(/[r厂■]/g, function (match) {
            return '<span class="origin">' + match + '</span><span class="highlight">「</span>';
        }).replace(/[Jj丄□]/g, function (match) {
            return '<span class="origin">' + match + '</span><span class="highlight">」</span>';
        });
        $('#outputText').html(result.replace(/\n/g, '<br>'));
    });

    $('#doubleCornerBracket').click(function () {
        var text = $('#inputText').val();
        var result = text.replace(/[r厂■「]/g, function (match) {
            return '<span class="origin">' + match + '</span><span class="highlight">『</span>';
        }).replace(/[Jj丄□」]/g, function (match) {
            return '<span class="origin">' + match + '</span><span class="highlight">』</span>';
        });
        $('#outputText').html(result.replace(/\n/g, '<br>'));
    });


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
            alert('Please select some text.');
        }
    }

    $('#wrapBracket').click(function () {
        wrapTextWithBrackets('(', ')');
    });

    $('#wrapTriangleBracket').click(function () {
        wrapTextWithBrackets('〈', '〉');
    });

    $('#wrapQuoteBracket').click(function () {
        wrapTextWithBrackets('“', '”');
    });

    $('#wrapSmallQuoteBracket').click(function () {
        wrapTextWithBrackets('‘', '’');
    });

    $('#wrapCornerBracket').click(function () {
        wrapTextWithBrackets('「', '」');
    });

    $('#outputText').on('click', '.highlight', function () {
        $(this).hide();
        $(this).prev('.origin').show();
    });

    $('#outputText').on('click', '.origin', function () {
        $(this).hide();
        $(this).next('.highlight').show();
    });

    // $('#copy').click(function () {
    //     var correctText = $('#outputText').html();

    //     correctText = correctText.replace(/<br\s*\/?>/gi, '\n')
    //                             .replace(/<span class="origin".*?>.*?<\/span>|<span class="highlight".*?>/gi, '')
    //                             .replace(/<\/span>/gi, '')
    //                             .replace(/&lt;/gi, '<')
    //                             .replace(/&gt;/gi, '>')
    //                             .replace(/&nbsp;/gi, ' ');

    //     $('#inputText').val(correctText);
    // });

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

    $('#copy').click(function () {
        var visibleText = getVisibleText($('#outputText'));
        navigator.clipboard.writeText(visibleText).then(function () {
            console.log('Visible text copied to clipboard');
        }).catch(function (err) {
            console.error('Could not copy text: ', err);
        });
    });

    $('#paste').click(function () {
        navigator.clipboard.readText().then(function (text) {
            $('#inputText').val(text);
            console.log('Text pasted from clipboard');
        }).catch(function (err) {
            console.error('Could not read text from clipboard: ', err);
        });
    });


});