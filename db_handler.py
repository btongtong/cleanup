import pyrebase
import json
import bcrypt
from datetime import datetime

class DBModule:
    def __init__(self):
        with open("./auth/firebase_config.json") as f:  # 설정파일 가져오기
            config = json.load(f)
        
        firebase = pyrebase.initialize_app(config)  # 초기화
        self.db = firebase.database()   # 데이터베이스 연결

    def get_posts(self):
        posts = self.db.child("posts").get()
        if posts.val():
            sorted_posts = sorted(posts.val().items(), key=lambda x: x[1]['datetime'], reverse=True)
            return dict(sorted_posts)
        else:
            return None
            
    def get_posts_by_title(self, title):
        all_posts = self.get_posts()
        if all_posts:
            filtered_posts = {k: v for k, v in all_posts.items() if title.lower() in v['title'].lower()}
            return filtered_posts
        else:
            return None
        

    def push_post(self, title, content, username, password):
        current_datetime = datetime.now().isoformat()   # 현재 시간 
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8') # 비밀번호 해싱        
        
        new_post = self.db.child("posts").push({    # 새 하위 요소마다 고유 키를 생성하고 저장 push() 
            'title': title,
            'content': content,
            'datetime': current_datetime,
            'username': username,
            'password': hashed_password
        })
            
        return new_post['name'] # 새 요소의 primary key
        
    def get_post(self, pid):
        post = self.db.child("posts").child(pid).get()
        return post.val() if post else None

    def update_post(self, pid, title, content):
        self.db.child("posts").child(pid).update({  # 부분 변경 update()
            'title': title,
            'content': content
        })

    def remove_post(self, pid):
        self.db.child("posts").child(pid).remove()

    def get_comments(self, pid):
        comments = self.db.child("posts").child(pid).child("comments").get()
        if comments.val():
            sorted_comments = sorted(comments.val().items(), key=lambda x: x[1]['datetime'], reverse=True)
            return sorted_comments
        else:
            return []
    
    def get_comment(self, pid, cid):
        comment = self.db.child("posts").child(pid).child("comments").child(cid).get()
        return comment.val() if comment else None

    def push_comment(self, pid, comment, username, password):
        current_datetime = datetime.now().isoformat()   # 현재 시간 
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8') # 비밀번호 해싱
            
        new_comment = self.db.child("posts").child(pid).child("comments").push({
            'comment': comment,
            'datetime': current_datetime,
            'username': username,
            'password': hashed_password
        })

        return new_comment['name']

    def update_comment(self, pid, cid, comment):
        self.db.child("posts").child(pid).child("comments").child(cid).update({
            "comment": comment
        })

    def remove_comment(self, pid, cid):
        self.db.child("posts").child(pid).child("comments").child(cid).remove()
        