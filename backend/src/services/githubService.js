const axios = require('axios');
const Repository = require('../models/Repository');
const Branch = require('../models/Branch');
const Commit = require('../models/Commit');

// --- [GitHub Service] GitHub API 연동 및 데이터 캐싱 로직 ---
// Why: GitHub API 호출 횟수를 절약하고 응답 속도를 향상시키기 위해 DB를 캐시 레이어로 활용함
// docs/db-schema.md의 트리 구조 설계와 plan.md 4.1의 동기화 전략을 반영함
const github = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    'Accept': 'application/vnd.github.v3+json'
  }
});

// 인터셉터를 사용하여 매 요청마다 최신 환경변수 반영 (로딩 시점 문제 해결)
github.interceptors.request.use(config => {
  const token = process.env.GITHUB_PAT;
  if (token) {
    config.headers.Authorization = `token ${token}`;
  }
  return config;
});

const githubService = {
  /**
   * 1. 리포지토리 목록 조회 및 캐싱
   * @param {boolean} sync - true일 경우 DB 무시하고 GitHub API 호출 후 동기화
   */
  fetchAndCacheRepos: async (sync = false) => {
    let repos = await Repository.find();
    if (repos.length > 0 && !sync) return repos;

    const response = await github.get('/user/repos?sort=updated');
    const repoData = response.data.map(repo => ({
      name: repo.name,
      owner: repo.owner.login
    }));

    if (sync) {
      await Repository.deleteMany({}); // 전체 동기화를 위해 기존 데이터 삭제
    }
    return await Repository.insertMany(repoData);
  },

  /**
   * 2. 브랜치 목록 조회 및 캐싱
   * @param {string} owner - 리포지토리 소유자
   * @param {string} repoName - 리포지토리 이름
   * @param {boolean} sync - true일 경우 DB 무시하고 동기화
   */
  fetchAndCacheBranches: async (owner, repoName, sync = false) => {
    const repo = await Repository.findOne({ owner, name: repoName });
    if (!repo) throw new Error(`Repository not found in DB: ${owner}/${repoName}`);

    let branches = await Branch.find({ repoId: repo._id });
    if (branches.length > 0 && !sync) return branches;

    const response = await github.get(`/repos/${owner}/${repoName}/branches`);
    const branchData = response.data.map(b => ({
      name: b.name,
      repoId: repo._id
    }));

    if (sync) {
      await Branch.deleteMany({ repoId: repo._id });
    }
    return await Branch.insertMany(branchData);
  },

  /**
   * 3. 커밋 로그 조회 및 캐싱
   * @param {string} owner - 리포지토리 소유자
   * @param {string} repoName - 리포지토리 이름
   * @param {string} branchName - 브랜치 이름
   * @param {boolean} sync - true일 경우 DB 무시하고 동기화
   */
  fetchAndCacheCommits: async (owner, repoName, branchName, sync = false) => {
    const repo = await Repository.findOne({ owner, name: repoName });
    const branch = await Branch.findOne({ name: branchName, repoId: repo?._id });
    if (!branch) throw new Error(`Branch not found in DB: ${branchName}`);

    let commits = await Commit.find({ branchId: branch._id });
    if (commits.length > 0 && !sync) return commits;

    const response = await github.get(`/repos/${owner}/${repoName}/commits?sha=${branchName}&per_page=10`);
    const commitData = response.data.map(c => ({
      sha: c.sha,
      message: c.commit.message,
      date: c.commit.author.date,
      branchId: branch._id
    }));

    if (sync) {
      await Commit.deleteMany({ branchId: branch._id });
    }
    return await Commit.insertMany(commitData);
  }
};

module.exports = githubService;
// --- [GitHub Service] 구현 종료 ---
