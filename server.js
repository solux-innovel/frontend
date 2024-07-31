const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 8080;

// Middleware
app.use(cors()); // CORS 설정
app.use(bodyParser.json()); // JSON 요청 본문 처리

// 기본 루트
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Kakao 로그인 엔드포인트
app.post('/api/users/kakao-login', (req, res) => {
  const {id, name, email, mobile} = req.body;

  console.log('Received data:', {id, name, email, mobile});

  // 응답을 JSON 형태로 반환
  res.json({
    success: true,
    message: 'User logged in successfully!',
    data: {id, name, email, mobile},
  });
});

// 서버 시작
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
