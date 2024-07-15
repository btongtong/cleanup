from auth.keys import BUCKET_NAME, REGION_NAME, AWS_ACCESS_KEY_ID, AWS_SECERT_ACCESS_KEY
from werkzeug.utils import secure_filename
import boto3
import uuid

class FileModule:
    def __init__(self):
        self.s3 = boto3.client(
                        service_name='s3',
                        region_name=REGION_NAME,
                        aws_access_key_id=AWS_ACCESS_KEY_ID,
                        aws_secret_access_key=AWS_SECERT_ACCESS_KEY)

    def file_upload(self, file):
        # 원래 파일 이름에서 확장자 추출
        original_filename = secure_filename(file.filename)
        file_ext = '.' + original_filename.split('.')[-1] if '.' in original_filename else ''

        # UUID를 사용하여 고유한 파일 이름 생성
        unique_filename = f"{uuid.uuid4().hex}{file_ext}"
        key = f"images/{unique_filename}"

        try:
            # S3에 파일 업로드
            self.s3.upload_fileobj(file, BUCKET_NAME, key)

            # 업로드된 파일의 공개 URL 생성
            url = f"https://{BUCKET_NAME}.s3.{REGION_NAME}.amazonaws.com/{key}"

            return url
        except Exception:
            return "fail"

    def file_delete(self, file_url):
        key = file_url.replace(f"https://{BUCKET_NAME}.s3.{REGION_NAME}.amazonaws.com/", "")

        try:
            self.s3.delete_object(Bucket=BUCKET_NAME, Key=key)
            return "success"
        except Exception:
            return "fail"
