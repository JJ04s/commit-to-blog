const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');

dotenv.config();

async function diagnose() {
  console.log("🔍 Gemini API 진단 시작...");
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("❌ 에러: GEMINI_API_KEY가 .env 파일에 없습니다.");
    return;
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    // 모델 목록 조회 (참고: 정식 SDK 버전에서는 listModels 지원 여부가 버전에 따라 다를 수 있음)
    // 여기서는 가장 직접적인 방법으로 1.5-flash와 2.5-flash에 각각 아주 작은 요청을 보내 할당량을 확인합니다.
    
    const modelsToTest = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-2.5-flash"];
    
    for (const modelName of modelsToTest) {
      console.log(`\n--- 테스트 모델: ${modelName} ---`);
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hi");
        const response = await result.response;
        console.log(`✅ ${modelName}: 정상 작동 (응답: ${response.text().trim()})`);
      } catch (err) {
        console.error(`❌ ${modelName} 실패:`);
        if (err.message.includes("429") || err.message.includes("limit: 0")) {
          console.error(`   -> 할당량 문제 (limit 0). 이 모델은 현재 계정에서 사용 불가할 수 있습니다.`);
        } else {
          console.error(`   -> 기타 에러: ${err.message}`);
        }
      }
    }

  } catch (globalError) {
    console.error("❌ 진단 중 예외 발생:", globalError.message);
  }
}

diagnose();
