const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// --- [Server Setup] 환경 변수 및 DB 연결 초기화 ---
// Why: .env 파일의 설정값을 불러오고, 앱 시작과 동시에 DB와 연결하기 위함
dotenv.config();
connectDB();

const app = express();

// --- [Middleware] 미들웨어 설정 ---
// Why: 외부(프론트엔드)에서의 요청을 허용(CORS)하고, 요청 본문의 JSON 데이터를 파싱하기 위함
app.use(cors());
app.use(express.json());

// --- [Route] 기본 테스트 라우트 ---
// Why: 서버가 정상적으로 구동되고 있는지 확인하기 위한 최소한의 엔드포인트
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Post 관련 API 라우트 마운트
const postRoutes = require('./routes/postRoutes');
const githubRoutes = require('./routes/githubRoutes');
const aiRoutes = require('./routes/aiRoutes');

app.use('/api/posts', postRoutes);
app.use('/api/github', githubRoutes);
app.use('/api/ai', aiRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// --- [Server Setup] 구현 종료 ---
