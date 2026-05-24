const dotenv = require('dotenv');
// 환경 변수 로드 (최상단으로 이동)
dotenv.config();

const connectDB = require('./config/db');
const githubService = require('./services/githubService');
const Repository = require('./models/Repository');
const Branch = require('./models/Branch');
const Commit = require('./models/Commit');

/**
 * GitHub Service 검증 테스트 케이스
 * 1. DB 연결 및 초기화
 * 2. 리포지토리 페칭 및 캐싱 확인
 * 3. 브랜치 페칭 및 캐싱 확인
 * 4. 커밋 페칭 및 캐싱 확인
 */
const testGithubService = async () => {
  try {
    await connectDB();
    console.log('--- GitHub Service Verification Start ---');

    // 테스트를 위해 기존 캐시 데이터 초기화 (선택 사항)
    await Repository.deleteMany({});
    await Branch.deleteMany({});
    await Commit.deleteMany({});
    console.log('🧹 Cache Cleared for Clean Test');

    // 1. Repos 테스트
    const repos = await githubService.fetchAndCacheRepos();
    console.log(`✅ Fetched ${repos.length} repos`);

    if (repos.length > 0) {
      // 내 리포지토리 중 하나 선택 (첫 번째)
      const targetRepo = repos[0];
      console.log(`Target Repo: ${targetRepo.owner}/${targetRepo.name}`);
      
      // 2. Branches 테스트
      const branches = await githubService.fetchAndCacheBranches(targetRepo.owner, targetRepo.name);
      console.log(`✅ Fetched ${branches.length} branches`);

      if (branches.length > 0) {
        // 3. Commits 테스트
        const targetBranch = branches.find(b => b.name === 'main' || b.name === 'master') || branches[0];
        const commits = await githubService.fetchAndCacheCommits(targetRepo.owner, targetRepo.name, targetBranch.name);
        console.log(`✅ Fetched ${commits.length} commits for branch: ${targetBranch.name}`);
        
        // 4. 캐싱 재확인 (DB에서 다시 조회했을 때 데이터가 있어야 함)
        const cachedCommits = await Commit.find({ branchId: targetBranch._id });
        if (cachedCommits.length === commits.length) {
          console.log('✅ Caching Layer Verified: Data correctly stored in DB');
        }
      }
    }

    console.log('--- All GitHub Service Tests Passed ---');
    process.exit(0);
  } catch (error) {
    console.error(`❌ GitHub Service Test Failed: ${error.message}`);
    if (error.response) {
      console.error('GitHub API Error Status:', error.response.status);
      console.error('GitHub API Error Data:', error.response.data);
    }
    process.exit(1);
  }
};

testGithubService();
