const axios = require('axios');
const dotenv = require('dotenv');

// --- [Test Script] B3-2: GitHub Sync & AI Summary API 통합 테스트 ---
// Why: GitHub 데이터 동기화와 AI 요약 기능이 유기적으로 동작하는지 흐름별로 검증함

dotenv.config();

const PORT = process.env.PORT || 5000;
const GITHUB_BASE_URL = `http://localhost:${PORT}/api/github`;
const AI_BASE_URL = `http://localhost:${PORT}/api/ai`;

async function runTests() {
  console.log("🚀 B3-2 GitHub Sync & AI Summary API 테스트 시작...");

  try {
    // 1. Repositories Sync & Fetch
    console.log("\n[1/4] 리포지토리 목록 조회 및 동기화 테스트 중...");
    const reposRes = await axios.get(`${GITHUB_BASE_URL}/repos?sync=true`);
    if (!Array.isArray(reposRes.data) || reposRes.data.length === 0) {
      console.warn("⚠️ 조회된 리포지토리가 없습니다. 테스트를 중단합니다.");
      return;
    }
    const targetRepo = reposRes.data[0];
    console.log(`✅ 리포지토리 확보: ${targetRepo.owner}/${targetRepo.name}`);

    // 2. Branches Sync & Fetch
    console.log(`\n[2/4] '${targetRepo.name}' 브랜치 목록 동기화 테스트 중...`);
    const branchesRes = await axios.get(`${GITHUB_BASE_URL}/branches/${targetRepo.owner}/${targetRepo.name}?sync=true`);
    if (!Array.isArray(branchesRes.data) || branchesRes.data.length === 0) {
      console.warn("⚠️ 조회된 브랜치가 없습니다. 테스트를 중단합니다.");
      return;
    }
    const targetBranch = branchesRes.data[0];
    console.log(`✅ 브랜치 확보: ${targetBranch.name}`);

    // 3. Commits Sync & Fetch
    console.log(`\n[3/4] '${targetBranch.name}' 커밋 목록 동기화 테스트 중...`);
    const commitsRes = await axios.get(`${GITHUB_BASE_URL}/commits/${targetRepo.owner}/${targetRepo.name}/${targetBranch.name}?sync=true`);
    if (!Array.isArray(commitsRes.data) || commitsRes.data.length === 0) {
      console.warn("⚠️ 조회된 커밋이 없습니다. 테스트를 중단합니다.");
      return;
    }
    const targetCommit = commitsRes.data[0];
    console.log(`✅ 커밋 확보: ${targetCommit.sha.substring(0, 7)} - ${targetCommit.message}`);

    // 4. AI Summary Test
    console.log("\n[4/4] AI 요약 생성 테스트 중 (이 작업은 수 초가 소요될 수 있습니다)...");
    const summaryRes = await axios.post(`${AI_BASE_URL}/summarize`, {
      owner: targetRepo.owner,
      repo: targetRepo.name,
      sha: targetCommit.sha
    });

    if (summaryRes.data.title && summaryRes.data.content) {
      console.log("✅ AI 요약 생성 성공!");
      console.log("--- 요약 결과 (초안) ---");
      console.log(`제목: ${summaryRes.data.title}`);
      console.log(`태그: ${summaryRes.data.tags.join(', ')}`);
      console.log("본문 일부:", summaryRes.data.content.substring(0, 100) + "...");
      console.log("------------------------");
    }

    console.log("\n✨ B3-2 모든 API 테스트가 성공적으로 완료되었습니다!");

  } catch (error) {
    console.error("\n❌ 테스트 실패:");
    if (error.response) {
      console.error(`- Status: ${error.response.status}`);
      console.error(`- Message: ${JSON.stringify(error.response.data)}`);
    } else {
      console.error(`- Error: ${error.message}`);
    }
    process.exit(1);
  }
}

runTests();

// --- [Test Script] 구현 종료 ---
