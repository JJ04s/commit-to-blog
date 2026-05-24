const dotenv = require('dotenv');
// 환경 변수 로드
dotenv.config();

const connectDB = require('./config/db');
const aiService = require('./services/aiService');

/**
 * AI Service 검증 테스트 케이스
 * 1. 실제 커밋 Diff 추출 확인
 * 2. Gemini API 연동 및 초안 생성 확인
 */
const testAiService = async () => {
  try {
    console.log('--- AI Service Verification Start ---');

    // 테스트용 타겟 커밋 (JJ04s/commit-to-blog의 최신 커밋 하나)
    const owner = 'JJ04s';
    const repo = 'commit-to-blog';
    const sha = 'main'; // 또는 실제 SHA

    // 1. Diff 추출 테스트
    console.log(`Fetching diff for ${owner}/${repo} at ${sha}...`);
    const diff = await aiService.fetchCommitDiff(owner, repo, sha);
    console.log('✅ Diff Extracted (Length:', diff.length, ')');

    // 2. AI 초안 생성 테스트
    console.log('Generating AI draft (this may take a few seconds)...');
    const draft = await aiService.generatePostDraft(diff);
    
    console.log('✅ AI Draft Generated Successfully:');
    console.log('Title:', draft.title);
    console.log('Tags:', draft.tags.join(', '));
    console.log('--- Content Preview ---');
    console.log(draft.content.substring(0, 200) + '...');
    
    console.log('--- All AI Service Tests Passed ---');
    process.exit(0);
  } catch (error) {
    console.error(`❌ AI Service Test Failed: ${error.message}`);
    process.exit(1);
  }
};

testAiService();
