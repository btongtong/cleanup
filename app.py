from flask import Flask, render_template, request, jsonify
import requests
from bs4 import BeautifulSoup
import re
import json

app = Flask(__name__)

# 부산대 맞춤법 검사기 URL
SPELL_CHECK_URL = 'http://speller.cs.pusan.ac.kr/results'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/check_spell', methods=['POST'])
def check_spell():
    # form에서 데이터 가져오기
    origin_text = request.form['text']

    # 크롤링할 때 필요한 값 설정
    data = {
        'text1': origin_text
    }

    # HTTP POST 맞춤법 검사
    response = requests.post(SPELL_CHECK_URL, data=data)
    soup = BeautifulSoup(response.text, 'html.parser')

    # script부분 추출
    scripts = soup.find_all('script')
    json_data = None

    # 여러 scripts 중 'data = []' 으로 된 부분 찾기
    for script in scripts:
        if script.string and 'data = [{' in script.string:
            match = re.search(r'data = (\[.*?\]);', script.string, re.DOTALL)
            if match:
                json_text = match.group(1)
                json_data = json.loads(json_text)
                break

    # json_data 프론트로 보내기
    if json_data:
        error_words = [error for result in json_data for error in result['errInfo']]
        return jsonify({'success': True, 'data': error_words})
    else:
        return jsonify({'success': False, 'message': 'Failed to retrieve JSON data'})

if __name__ == '__main__':
    app.run(debug=True)
