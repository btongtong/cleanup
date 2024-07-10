# CLEAN UP

<p align="center"><img width="300" alt="로고" src="https://github.com/btongtong/typo-correction/assets/145460142/1f111b3e-ab71-46d0-ad7d-39e546f3cd68"></p>

> **시각장애인을 위한 전자책 제작 보조 프로그램** <br> **개발 기간: 2024-06-20 ~ 2024-07-05**

## URL
> **배포 URL: https://www.btongtong.store** <br>
> **프로젝트 구현 기록 URL: https://ten-wind-194.notion.site/CLEAN-UP-2d3be566622c4fba82843d72a26aac8d?pvs=4**

## 프로젝트 소개

클린업은 실로암복지관의 전자도서 제작 봉사활동을 지원하는 글자 교정 프로그램입니다. 이 프로그램은 맞춤법 오류와 반복되는 특수기호 오류 등을 제작 규칙에 따라 신속하게 수정함으로써 봉사활동의 효율성을 높입니다. 클린업을 통해 실로암복지관의 전자도서 제작 봉사자들은 보다 체계적이고 편리한 환경에서 활동할 수 있습니다.

## 개발 환경

### 백엔드
<img src="https://img.shields.io/badge/python-3776AB?style=for-the-badge&logo=python&logoColor=white"> <img src="https://img.shields.io/badge/flask-000000?style=for-the-badge&logo=flask&logoColor=white">

### 프론트엔드
<img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=white"> <img src="https://img.shields.io/badge/jquery-0769AD?style=for-the-badge&logo=jquery&logoColor=white"> <img src="https://img.shields.io/badge/html5-E34F26?style=for-the-badge&logo=html5&logoColor=white"> <img src="https://img.shields.io/badge/css3-1572B6?style=for-the-badge&logo=css3&logoColor=white">

### 데이터베이스
<img src="https://img.shields.io/badge/firebase-DD2C00?style=for-the-badge&logo=firebase&logoColor=white">

### 서버 및 배포 환경
<img src="https://img.shields.io/badge/amazonwebservices-E95420?style=for-the-badge&logo=amazonwebservices&logoColor=white"> <img src="https://img.shields.io/badge/ubuntu-E95420?style=for-the-badge&logo=ubuntu&logoColor=white"> <img src="https://img.shields.io/badge/gunicorn-499848?style=for-the-badge&logo=gunicorn&logoColor=white"> <img src="https://img.shields.io/badge/nginx-009639?style=for-the-badge&logo=nginx&logoColor=white"> <img src="https://img.shields.io/badge/openssl-721412?style=for-the-badge&logo=openssl&logoColor=white">

### 버전 관리
<img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white">

## 디렉토리 구조

```
📦 spell-check
├─ .DS_Store
├─ .gitignore
├─ app.py
├─ db_handler.py
├─ requirements.txt
├─ static
│  ├─ css
│  │  ├─ base.css
│  │  ├─ index.css
│  │  ├─ post.css
│  │  ├─ post_edit.css
│  │  ├─ post_new.css
│  │  └─ posts.css
│  ├─ image
│  │  └─ logo.png
│  └─ js
│     ├─ base.js
│     ├─ index.js
│     ├─ post.js
│     ├─ post_edit.js
│     ├─ post_new.js
│     └─ posts.js
└─ templates
   ├─ base.html
   ├─ index.html
   ├─ post.html
   ├─ post_edit.html
   ├─ post_new.html
   └─ posts.html
```
## 주요 기능
### 문자 교정
- 부산대학교 맞춤법 검사기를 크롤링하여 글의 철자 및 문법 오류 검사
- 전자책 제작 가이드에 맞춰 특수문자 및 기호 자동 변환

### 문의, 후기 게시판
- 사용자들이 개선 사항 제안, 기능 추가 요청, 사용 후기 등을 자유롭게 작성할 수 있는 게시판 제공
- 게시글 및 댓글 작성, 삭제, 수정 기능 구현

## 화면 구성
<table>
    <tr>
        <th style="text-align:center">글자 교정 메인 화면</th>
        <th style="text-align:center">게시글 목록</th>
    </tr>
    <tr>
        <td><img width="1470" alt="글자교정" src="https://github.com/btongtong/typo-correction/assets/145460142/9bcea7b0-0174-405e-a961-ebe740c96a5d"></td>
        <td><img width="1470" alt="게시글목록" src="https://github.com/btongtong/typo-correction/assets/145460142/507efdd7-5181-4a65-9225-9490c1500f53"></td>
    </tr>
    <tr>
        <th style="text-align:center">게시글 및 댓글</th>
        <th style="text-align:center">비밀번호 인증</th>
    </tr>
    <tr>
        <td><img width="1469" alt="게시글상세" src="https://github.com/btongtong/typo-correction/assets/145460142/bd2b5b05-bf86-4a07-9d54-e22cc4a64d89"></td>
        <td><img width="1470" alt="삭제수정시비밀번호인증" src="https://github.com/btongtong/typo-correction/assets/145460142/fd34ef06-00ee-45bb-bdea-49d3e969e655"></td>
    </tr>
</table>
