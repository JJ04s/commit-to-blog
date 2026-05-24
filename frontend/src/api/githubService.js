import axios from 'axios';

const api = axios.create({
  baseURL: '/api/github',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const githubService = {
  // 사용자의 레포지토리 목록 가져오기
  getRepositories: async () => {
    const response = await api.get('/repos');
    return response.data;
  },

  // 특정 레포의 브랜치 목록 가져오기 (owner 포함)
  getBranches: async (owner, repoName) => {
    const response = await api.get(`/branches/${owner}/${repoName}`);
    return response.data;
  },

  // 특정 브랜치의 커밋 목록 가져오기 (owner, repo, branch 포함)
  getCommits: async (owner, repoName, branchName) => {
    const response = await api.get(`/commits/${owner}/${repoName}/${branchName}`);
    return response.data;
  },

  // GitHub 데이터 강제 동기화 (기존 getRepos에 sync=true 쿼리 활용 가능하지만 별도 POST 유지)
  syncData: async () => {
    const response = await api.get('/repos', { params: { sync: true } });
    return response.data;
  }
};

export default githubService;
