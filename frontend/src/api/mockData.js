// Mock Data for Frontend Development
export const MOCK_POSTS = [
  {
    id: 1,
    title: 'React Context API를 활용한 전역 상태 관리 최적화',
    repository: 'commit-to-blog',
    type: 'Feat',
    tags: ['react', 'context-api', 'optimization'],
    createdAt: '2026-05-20T10:00:00Z',
  },
  {
    id: 2,
    title: 'MongoDB 인덱스 설정으로 쿼리 성능 200% 향상시키기',
    repository: 'backend-core',
    type: 'Refactor',
    tags: ['mongodb', 'database', 'performance'],
    createdAt: '2026-05-21T15:30:00Z',
  },
  {
    id: 3,
    title: '로그인 로직의 보안 취약점 수정 및 테스트 코드 추가',
    repository: 'auth-service',
    type: 'Fix',
    tags: ['security', 'jest', 'auth'],
    createdAt: '2026-05-22T09:15:00Z',
  },
  {
    id: 4,
    title: 'Express 미들웨어를 활용한 에러 핸들링 구조 재설계',
    repository: 'commit-to-blog',
    type: 'Refactor',
    tags: ['node.js', 'express', 'error-handling'],
    createdAt: '2026-05-23T11:45:00Z',
  },
  {
    id: 5,
    title: 'Vite 환경에서의 프로젝트 초기 설정 가이드',
    repository: 'frontend-boilerplate',
    type: 'Docs',
    tags: ['vite', 'frontend', 'setup'],
    createdAt: '2026-05-24T14:20:00Z',
  }
];

export const MOCK_REPOS = [
  { id: 1, name: 'commit-to-blog', description: 'AI driven dev blog' },
  { id: 2, name: 'backend-core', description: 'Core API service' },
  { id: 3, name: 'auth-service', description: 'Authentication microservice' }
];

export const MOCK_BRANCHES = [
  { name: 'main', repo: 'commit-to-blog' },
  { name: 'develop', repo: 'commit-to-blog' },
  { name: 'main', repo: 'backend-core' }
];

export const MOCK_COMMITS = [
  { 
    sha: 'sha123456789', 
    message: 'feat: add global context provider', 
    date: '2026-05-25T10:00:00Z', 
    repo: 'commit-to-blog',
    author: 'pjjun'
  },
  { 
    sha: 'sha987654321', 
    message: 'fix: layout breakage in editor', 
    date: '2026-05-25T11:00:00Z', 
    repo: 'commit-to-blog',
    author: 'pjjun'
  },
  { 
    sha: 'shabackend001', 
    message: 'chore: update mongoose schema', 
    date: '2026-05-24T09:00:00Z', 
    repo: 'backend-core',
    author: 'pjjun'
  }
];

// Helper to get unique repositories from posts
export const getMockRepositories = () => {
  return MOCK_REPOS.map(repo => repo.name);
};
