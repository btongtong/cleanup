import { errorMsg } from "./error_message.js";

// 특수문자 매핑 설정
const SPECIAL_CHAR_MAPPINGS = {
    regExpBrackets: {
        smallQuote: { regExp: /['‘]([^'‘’]+)['’]/g, open: '‘', close: '’' },
        quote: { regExp: /["“]([^"“”]+)["”]/g, open: '“', close: '”' },
        triangle: { regExp: /[<〈]([^>]+)[>〉]/g, open: '〈', close: '〉' },
        doubleTriangle: { regExp: /<<|《([^>]+)>>|》/g, open: '《', close: '》' },
        corner: { regExp: /[r厂■]([^\s]*)[Jj丄□]/g, open: '「', close: '」' },
        doubleCorner: { regExp: /[r厂■「]([^\s]*)[Jj丄□」]/g, open: '『', close: '』' }
    },
    brackets: {
        regular: { open: '(', close: ')' },
        smallQuote: { open: '‘', close: '’' },
        quote: { open: '“', close: '”' },
        triangle: { open: '〈', close: '〉' },
        doubleTriangle: { open: '《', close: '》' },
        corner: { open: '「', close: '」' },
        doubleCorner: { open: '『', close: '』' }
    },
    combinations: [
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
    ]
};

// 유틸리티 함수들
const TextUtils = {
    // 텍스트를 하이라이트된 형식으로 변환
    createHighlightedSpan(original, highlighted) {
        return `<span class="origin">${original}</span><span class="highlight">${highlighted}</span>`;
    },

    // 줄바꿈을 HTML <br> 태그로 변환
    convertNewlines(text) {
        return text.replace(/\n/g, '<br>');
    }
};

// 텍스트 처리 클래스
class TextProcessor {
    constructor(inputSelector, outputSelector) {
        this.inputElement = $(inputSelector);
        this.outputElement = $(outputSelector);
        this.setupEventListeners();
    }

    // 이벤트 리스너 설정
    setupEventListeners() {
        // 하이라이트 클릭 이벤트
        this.outputElement.on('click', '.highlight', function() {
            $(this).hide().prev('.origin').show();
        });

        // 원본 클릭 이벤트
        this.outputElement.on('click', '.origin', function() {
            $(this).hide().next('.highlight').show();
        });
    }

    // 맞춤법 검사 수행
    async checkGrammar() {
        const text = this.inputElement.val();
        this.outputElement.html('<strong>맞춤법 검사를 진행하고 있습니다.</strong>');

        try {
            const response = await $.ajax({
                type: 'POST',
                url: '/check-spell',
                data: { text }
            });

            if (response.success) {
                this.processGrammarResponse(response.data, text);
            } else {
                throw new Error(errorMsg.spellingError);
            }
        } catch (error) {
            this.outputElement.text('');
            alert(errorMsg.spellingError);
        }
    }

    // 맞춤법 검사 결과 처리
    processGrammarResponse(data, originalText) {
        let correctedText = originalText;
        let offset = 0;

        data.forEach(error => {
            if (!error.candWord) return;

            const start = error.start + offset;
            const end = error.end + offset;
            const replacement = TextUtils.createHighlightedSpan(error.orgStr, error.candWord);
            
            correctedText = correctedText.substring(0, start) +
                        replacement +
                        correctedText.substring(end);
            
            offset += replacement.length - (end - start);
        });

        this.outputElement.html(TextUtils.convertNewlines(correctedText));
    }

    // 특수문자 변환
    convertSpecialCharacters() {
        const text = this.inputElement.val();
        let processedText = text;

        SPECIAL_CHAR_MAPPINGS.combinations.forEach(([search, replace]) => {
            processedText = processedText.split(search)
                .join(TextUtils.createHighlightedSpan(search, replace));
        });

        this.outputElement.html(TextUtils.convertNewlines(processedText));
    }

    // 텍스트를 특정 기호 규칙에 맞게 변환
    convertSign(type) {
        const inputText = $('#inputText').val();
        const { regExp, open, close } = SPECIAL_CHAR_MAPPINGS.regExpBrackets[type];
        
        const newText = inputText.replace(regExp, (match, group1) =>
            `${TextUtils.createHighlightedSpan(match, open + group1 + close)}`
        );
        
        $('#outputText').html(TextUtils.convertNewlines(newText));
    }

    // 드레그한 텍스트를 괄호로 감싸기
    wrapWithBrackets(leftBracket, rightBracket) {
        const textarea = this.inputElement[0];
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        if (start === end) {
            alert(errorMsg.dragError);
            return;
        }

        const text = textarea.value;
        const selectedText = text.substring(start, end);
        const wrappedText = TextUtils.createHighlightedSpan(
            selectedText,
            leftBracket + selectedText + rightBracket
        );

        const newText = text.substring(0, start) + wrappedText + text.substring(end);
        this.outputElement.html(TextUtils.convertNewlines(newText));
    }
}

// 클립보드 관리 클래스
class ClipboardManager {
    constructor(copyButtonSelector, pasteButtonSelector, inputSelector, outputSelector) {
        this.copyButton = $(copyButtonSelector);
        this.pasteButton = $(pasteButtonSelector);
        this.inputElement = $(inputSelector);
        this.outputElement = $(outputSelector);
        this.setupEventListeners();
    }

    // 이벤트 리스너 설정
    setupEventListeners() {
        this.copyButton.click(() => this.copyToClipboard());
        this.pasteButton.click(() => this.pasteFromClipboard());
    }

    // 클립보드로 복사
    async copyToClipboard() {
        try {
            const visibleText = this.getVisibleText(this.outputElement);
            await navigator.clipboard.writeText(visibleText);
            this.showConfirmation('copy');
        } catch (error) {
            console.error('복사 실패:', error);
        }
    }

    //  클립보드에서 붙여넣기
    async pasteFromClipboard() {
        try {
            const text = await navigator.clipboard.readText();
            this.inputElement.val(text);
            this.showConfirmation('paste');
        } catch (error) {
            console.error('붙여넣기 실패:', error);
        }
    }

    // 보이는 텍스트만 추출
    getVisibleText(element) {
        return element.contents()
            .filter(function() {
                return this.nodeType === Node.TEXT_NODE || $(this).is(':visible');
            })
            .map(function() {
                if (this.nodeType === Node.TEXT_NODE) return this.nodeValue;
                if ($(this).is('br')) return '\n';
                return $(this).text();
            })
            .get()
            .join('');
    }

    // 확인 메시지 표시
    showConfirmation(action) {
        const button = action === 'copy' ? this.copyButton : this.pasteButton;
        const confirmClass = `.${action}-confirm`;

        button.hide();
        $(confirmClass).css('display', 'flex');
        
        setTimeout(() => {
            $(confirmClass).hide();
            button.css('display', 'flex');
        }, 2000);
    }
}

// 문서 로드 완료 시 초기화
$(document).ready(function() {
    const textProcessor = new TextProcessor('#inputText', '#outputText');
    const clipboardManager = new ClipboardManager('#copy', '#paste', '#inputText', '#outputText');

    // 버튼 이벤트 바인딩
    $('#grammar').click(() => textProcessor.checkGrammar());
    $('#combination').click(() => textProcessor.convertSpecialCharacters());

    // 드레그한 텍스트 감싸는 괄호 변환 버튼들 바인딩
    Object.entries(SPECIAL_CHAR_MAPPINGS.brackets).forEach(([type, brackets]) => {
        $(`#wrap${type.charAt(0).toUpperCase() + type.slice(1)}Bracket`).click(() => 
            textProcessor.wrapWithBrackets(brackets.open, brackets.close)
        );
    });
    
    // 특정 기호 규정에 맞게 변환 버튼들 바인딩
    Object.entries(SPECIAL_CHAR_MAPPINGS.regExpBrackets).forEach(([type]) => {
        $(`#${type}Bracket`).click(() => 
            textProcessor.convertSign(type)
        );
    });
});