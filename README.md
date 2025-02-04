# CLEAN UP

<p align="center"><img width="300" alt="로고" src="https://github.com/btongtong/typo-correction/assets/145460142/1f111b3e-ab71-46d0-ad7d-39e546f3cd68"></p>

> **시각장애인을 위한 전자책 제작 보조 프로그램** <br> **개발 기간: 2024-06-20 ~ 2024-07-05**

## URL
> **배포 URL: https://www.bttcleanup.store/posts/-OI6lAF4I7N2vz_jd7p7** <br>
> **프로젝트 구현 기록 URL: https://noon-chance-53f.notion.site/CLEAN-UP-123cf60ac914815aa830da6655e66102?pvs=4**

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

## 주요 기능
### 문자 교정
- 부산대학교 맞춤법 검사기를 크롤링하여 글의 철자 및 문법 오류 검사
- 전자책 제작 가이드에 맞춰 특수문자 및 기호 자동 변환

### 문의, 후기 게시판
- 사용자들이 개선 사항 제안, 기능 추가 요청, 사용 후기 등을 자유롭게 작성할 수 있는 게시판 제공
- 게시글 및 댓글 작성, 삭제, 수정 기능 구현

## 데이터베이스 구조
<table>
    <tr>
        <th style="text-align:center">게시글</th>
        <th style="text-align:center">댓글</th>
    </tr>
    <tr>
        <td><img width="1470" alt="게시글" src="https://github.com/user-attachments/assets/8e5e2725-befa-40b7-8887-0d9ff2642a61"></td>
        <td><img width="1470" alt="댓글" src="https://github.com/user-attachments/assets/b5f7410f-8c20-4b2a-9970-d51780864579"></td>
    </tr>
</table>

## 유저 플로우
<table>
    <tr>
        <th style="text-align:center">텍스트 교정</th>
        <th style="text-align:center">게시글 작성</th>
    </tr>
    <tr>
        <td><img width="1470" alt="텍스트 교정" src="https://github.com/user-attachments/assets/a4a30841-617a-4f6a-970e-13b8c13465d9"></td>
        <td><img width="1470" alt="게시글 검색" src="https://github.com/user-attachments/assets/619dfb18-66dd-4859-a634-c5f2db2fbf53"></td>
    </tr>
    <tr>
        <th style="text-align:center">게시글 작성</th>
        <th style="text-align:center">게시글 수정 & 삭제</th>
    </tr>
    <tr>
        <td><img width="1470" alt="게시글 작성" src="https://github.com/user-attachments/assets/3c12d567-19ec-41ec-a9d2-01c82495a67b"></td>
        <td><img width="1470" alt="게시글 수정 & 삭제" src="https://github.com/user-attachments/assets/11638f1c-2b64-4cf9-a9d5-65c08088f48a"></td>
    </tr>
    <tr>
        <th style="text-align:center">댓글 작성</th>
        <th style="text-align:center">댓글 수정 & 삭제</th>
    </tr>
    <tr>
        <td><img width="1470" alt="댓글 작성" src="https://github.com/user-attachments/assets/e18e303d-e4fc-496a-83ef-4c92626c6d93"></td>
        <td><img width="1470" alt="댓글 수정 & 삭제" src="https://github.com/user-attachments/assets/322e3654-1538-41d7-a4fb-9a21e6d17ffb"></td>
    </tr>
</table>

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
