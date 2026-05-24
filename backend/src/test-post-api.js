const axios = require('axios');
const dotenv = require('dotenv');

// --- [Test Script] Post CRUD API 통합 테스트 ---
// Why: B3-1에서 구현한 포스트 관리 API가 정상적으로 동작하는지 시나리오별로 검증함

dotenv.config();

const BASE_URL = `http://localhost:${process.env.PORT || 5000}/api/posts`;

const testData = {
  title: "테스트 포스트",
  content: "이것은 API 테스트를 위한 마크다운 본문입니다.",
  tags: ["Test", "Node.js"],
  repoName: "user/test-repo",
  commitSha: "test_sha_" + Date.now(), // 고유값 생성을 위해 타임스탬프 활용
  githubUrl: "https://github.com/user/test-repo/commit/test_sha"
};

async function runTests() {
  console.log("🚀 Post CRUD API 테스트 시작...");
  let testPostId = null;

  try {
    // 1. Create Test
    console.log("\n[1/5] Post 생성 테스트 중...");
    const createRes = await axios.post(BASE_URL, testData);
    if (createRes.status === 201) {
      console.log("✅ 생성 성공:", createRes.data._id);
      testPostId = createRes.data._id;
    }

    // 2. List Test (with Filter)
    console.log("\n[2/5] Post 목록 조회 테스트 중...");
    const listRes = await axios.get(`${BASE_URL}?repo=${testData.repoName}`);
    const found = listRes.data.find(p => p.commitSha === testData.commitSha);
    if (found) {
      console.log("✅ 목록 조회 및 필터링 성공");
    } else {
      throw new Error("목록에서 생성된 포스트를 찾을 수 없습니다.");
    }

    // 3. Single Fetch Test (by SHA)
    console.log("\n[3/5] 단건 조회 테스트 (SHA 기반) 중...");
    const singleRes = await axios.get(`${BASE_URL}/${testData.commitSha}`);
    if (singleRes.data.title === testData.title) {
      console.log("✅ 단건 조회 성공");
    }

    // 4. Update Test
    console.log("\n[4/5] Post 수정 테스트 중...");
    const updateData = { title: "수정된 테스트 제목" };
    const updateRes = await axios.put(`${BASE_URL}/${testPostId}`, updateData);
    if (updateRes.data.title === updateData.title) {
      console.log("✅ 수정 성공");
    }

    // 5. Delete Test
    console.log("\n[5/5] Post 삭제 테스트 중...");
    const deleteRes = await axios.delete(`${BASE_URL}/${testPostId}`);
    if (deleteRes.status === 200) {
      console.log("✅ 삭제 성공");
    }

    console.log("\n✨ 모든 테스트가 성공적으로 완료되었습니다!");
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
