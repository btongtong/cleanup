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

                    data.forEach(function (error) {
                        console.log(error)
                        var orgStr = error['orgStr'];
                        var candWord = error['candWord'];
                        var regex = new RegExp(`(?!<span[^>]*?>)${orgStr}(?![^<]*?</span>)`, 'g');
                        
                        correctedText = correctedText.replace(regex, function () {
                            return '<span class="origin">' + orgStr + '</span><span class="highlight">' + candWord + '</span>';
                        });
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
        var newText = text.replace(/\b([a-zA-Z\s,]+)\b/g, function(match) {
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
        var result = text.replace(/[r厂■]/g, function(match) {
            return '<span class="origin">' + match + '</span><span class="highlight">「</span>';
        }).replace(/[Jj丄□]/g, function(match) {
            return '<span class="origin">' + match + '</span><span class="highlight">」</span>';
        });
        $('#outputText').html(result.replace(/\n/g, '<br>'));
    });

    $('#doubleCornerBracket').click(function () {
        var text = $('#inputText').val();
        var result = text.replace(/[r厂■「]/g, function(match) {
            return '<span class="origin">' + match + '</span><span class="highlight">『</span>';
        }).replace(/[Jj丄□」]/g, function(match) {
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

    $('#copy').click(function () {
        var correctText = $('#outputText').html();
    
        correctText = correctText.replace(/<br\s*\/?>/gi, '\n')
                                .replace(/<span class="origin".*?>.*?<\/span>|<span class="highlight".*?>/gi, '')
                                .replace(/<\/span>/gi, '')
                                .replace(/&lt;/gi, '<')
                                .replace(/&gt;/gi, '>')
                                .replace(/&nbsp;/gi, ' ');
    
        $('#inputText').val(correctText);
    });
    
});