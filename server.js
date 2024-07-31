// frontend/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 8080; // 포트 번호를 8080으로 변경

// 미들웨어 설정
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 네이버 로그인 엔드포인트
app.post('/api/users/login', (req, res) => {
  const { id, nickname, email } = req.body; // nickname 추가

  // 사용자 프로필 데이터를 처리합니다.
  console.log('네이버 사용자 프로필:');
  console.log('ID:', id);
  console.log('Nickname:', nickname); // nickname 출력
  console.log('Email:', email);

  // 예시: 데이터베이스에 저장하는 로직을 추가합니다.
  // Your database logic here

  // 응답
  res.status(200).json({ message: '네이버 사용자 프로필을 성공적으로 수신했습니다.' });
});

// 서버 시작
app.listen(port, () => {
  console.log(`서버가 포트 ${port}에서 실행 중입니다.`);
});