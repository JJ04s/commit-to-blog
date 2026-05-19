const mongoose = require('mongoose');

// --- [Database Connection] MongoDB 연결 로직 ---
// Why: 어플리케이션의 모든 데이터를 저장하는 MongoDB와 백엔드 서버를 연결하기 위함
// .env 파일의 MONGO_URI를 참조하여 유연하게 환경을 변경할 수 있도록 함
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); // 연결 실패 시 프로세스 종료
  }
};

module.exports = connectDB;
// --- [Database Connection] 구현 종료 ---
