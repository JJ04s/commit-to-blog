const githubService = require('../services/githubService');

// --- [GitHub Controller] GitHub 데이터 동기화 및 조회 핸들러 ---
// Why: 프론트엔드에서 리포지토리, 브랜치, 커밋 목록을 단계적으로 선택할 수 있도록 API 응답 제공

// 1. 리포지토리 목록 조회
exports.getRepos = async (req, res) => {
  try {
    const sync = req.query.sync === 'true';
    const repos = await githubService.fetchAndCacheRepos(sync);
    res.status(200).json(repos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. 브랜치 목록 조회
exports.getBranches = async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const sync = req.query.sync === 'true';
    const branches = await githubService.fetchAndCacheBranches(owner, repo, sync);
    res.status(200).json(branches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. 커밋 목록 조회
exports.getCommits = async (req, res) => {
  try {
    const { owner, repo, branch } = req.params;
    const sync = req.query.sync === 'true';
    const commits = await githubService.fetchAndCacheCommits(owner, repo, branch, sync);
    res.status(200).json(commits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
