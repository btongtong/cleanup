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

    