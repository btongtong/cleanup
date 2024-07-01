from flask import Flask, redirect, url_for, render_template, request, jsonify, flash, session
from db_handler import DBModule
from bs4 import BeautifulSoup
from datetime import datetime
import requests
import bcrypt
import json
import re

app = Flask(__name__)
app.secret_key = "dlrpantmsrlsmddmfgksmswldkfdkqhkdirpTek"
DB = DBModule()

# 부산대 맞춤법 검사기 URL
SPELL_CHECK_URL = 'http://speller.cs.pusan.ac.kr/results'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/check-spell', methods=['POST'])
def check_spell():
    # form에서 데이터 가져오기
    origin_text = request.form['text'].replace('\n', '\r')  # 줄바꿈 처리를 인식 못해서 비교해봤더니 맞춤법 검사기는 \r 을 줄바꿈 표시로 인식하고 있어서 줄바꿈을 다 \r로 바꿔주기
    print(origin_text)

    # BOM 제거
    origin_text = origin_text.replace('\ufeff', ' ')

    # 크롤링할 때 필요한 값 설정
    data = {
        'text1': origin_text
    }

    headers = {
        "User-Agent": "Mozilla/5.0"
    }

    # HTTP POST 맞춤법 검사
    response = requests.post(SPELL_CHECK_URL, headers=headers, data=data)
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
        print(json_data)
        error_words = [error for result in json_data for error in result['errInfo']]
        print(error_words)
        return jsonify({'success': True, 'data': error_words})
    else:
        return jsonify({'success': False, 'message': 'Failed to retrieve JSON data'})

@app.route('/posts/<string:pid>/check-password', methods=['POST'])
def check_post_password(pid):
    post = DB.get_post(pid)
    password = request.form['password'].encode('utf-8')
    hashed_password = post['password'].encode('utf-8')

    if bcrypt.checkpw(password, hashed_password):
        session['pid'] = pid
        return jsonify({'success': True, 'message': 'Password is correct'})
    else:
        return jsonify({'success': False, 'message': 'Password is not correct'})
    
@app.route('/posts/<string:pid>/comments/<string:cid>/check-password', methods=['POST'])
def check_comment_password(pid, cid):
    comment = DB.get_comment(pid, cid)
    password = request.form['password'].encode('utf-8')
    hashed_password = comment['password'].encode('utf-8')

    if bcrypt.checkpw(password, hashed_password):
        session['cid'] = pid
        return jsonify({'success': True, 'message': 'Password is correct'})
    else:
        return jsonify({'success': False, 'message': 'Password is not correct'})

@app.route('/posts', methods=['GET'])
def get_posts():
    title = request.args.get('title')
    page = int(request.args.get('page', 1))
    
    if title:
        posts, total_count = DB.get_posts_by_title(title, page)
    else:
        posts, total_count = DB.get_posts(page)

    if posts is None:
        posts = {}
    return render_template('posts.html', posts=posts.items(), page=page, total_count=total_count)

@app.route('/post/new', methods=['POST'])
def push_post():
    title = request.form['title']
    content = request.form['content']
    username = request.form['username']
    password = request.form['password']
    pid = DB.push_post(title, content, username, password)
    return jsonify({'success': True, 'pid': pid})

@app.route('/post/new', methods=['GET'])
def get_post_write():
    return render_template('post_new.html')

@app.route('/posts/<string:pid>', methods=['GET'])
def get_post(pid):
    post = DB.get_post(pid)
    return render_template('post.html', post=post, pid=pid)

@app.route('/posts/<string:pid>/edit', methods=['GET'])
def get_post_edit(pid):
    if 'pid' in session:
        post = DB.get_post(pid)
        return render_template('post_edit.html', post=post, pid=pid)
    else:
        flash('비밀번호 인증이 필요합니다')
        return redirect(url_for('get_post', pid=pid))

@app.route('/posts/<string:pid>/edit', methods=['PUT'])
def update_post(pid):
    if 'pid' in session:
        title = request.form['title']
        content = request.form['content']
        DB.update_post(pid, title, content)
        session.pop('pid', None)
        return jsonify({'success': True})
    else:
        session.pop('pid', None)
        return jsonify({'success': False})

@app.route('/posts/<string:pid>/delete', methods=['DELETE'])
def remove_post(pid):
    if 'pid' in session:
        DB.remove_post(pid)
        session.pop('pid', None)
        return jsonify({'success': True})
    else:
        session.pop('pid', None)
        return jsonify({'success': False})

@app.route('/posts/<string:pid>/comments', methods=['GET'])
def get_comments(pid):
    comments = DB.get_comments(pid)
    print(comments)
    return jsonify({'success': True, 'data': comments})

@app.route('/posts/<string:pid>/comments/new', methods=['POST'])
def push_comments(pid):
    comment = request.form['comment']
    username = request.form['username']
    password = request.form['password']
    cid = DB.push_comment(pid, comment, username, password)
    return jsonify({'success': True, 'cid': cid})

@app.route('/posts/<string:pid>/comments/<string:cid>/edit', methods=['PUT'])
def update_comment(pid, cid):
    if 'cid' in session:
        comment = request.form['comment']
        DB.update_comment(pid, cid, comment)
        session.pop('cid', None)
        return jsonify({'success': True})
    else:
        session.pop('cid', None)
        return jsonify({'success': False})

@app.route('/posts/<string:pid>/comments/<string:cid>/delete', methods=['DELETE'])
def remove_comment(pid, cid):
    if 'cid' in session:
        DB.remove_comment(pid, cid)
        session.pop('cid', None)
        return jsonify({'success': True})
    else:
        session.pop('cid', None)
        return jsonify({'success': False})
    
@app.template_filter('format_datetime')
def format_datetime(value, format='%Y-%m-%d %H:%M'):
    if value is None:
        return ""
    if isinstance(value, str):
        try:
            value = datetime.strptime(value, '%Y-%m-%dT%H:%M:%S.%f')  # ISO 8601 형식
        except ValueError:
            try:
                value = datetime.strptime(value, '%Y-%m-%d %H:%M:%S')  # 기본 형식
            except ValueError:
                return value  # 변환 불가하면 원래 문자열 반환
    return value.strftime(format)

if __name__ == '__main__':
    app.run(debug=True)

