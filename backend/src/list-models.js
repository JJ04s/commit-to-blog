const dotenv = require('dotenv');
dotenv.config();

/**
 * 사용 가능한 Gemini 모델 목록 확인 스크립트
 * Why: 404 Not Found 에러를 해결하기 위해 현재 API 키로 접근 가능한 정확한 모델명을 확인함
 */
async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY not found in .env');
    process.exit(1);
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    
    if (data.error) {
      console.error('❌ API Error:', data.error.message);
      process.exit(1);
    }

    console.log('--- Available Models List ---');
    data.models.forEach(model => {
      // 텍스트 생성이 가능한 모델만 출력
      if (model.supportedGenerationMethods.includes('generateContent')) {
        console.log(`- ${model.name}`);
      }
    });
    console.log('----------------------------');
    process.exit(0);
  } catch (error) {
    console.error('❌ Request Failed:', error.message);
    process.exit(1);
  }
}

listModels();
