import api from './postService';

// --- [AI Service] AI 요약 요청 API 모듈 ---
// Why: 백엔드에 커밋 Diff 분석을 요청하여 학습용 회고록 초안을 받아옴

export const aiService = {
  /**
   * 커밋 분석 및 요약 생성 요청
   * @param {string} owner - 리포지토리 소유자
   * @param {string} repo - 리포지토리 이름
   * @param {string} sha - 커밋 SHA
   */
  summarizeCommit: async (owner, repo, sha) => {
    try {
      const response = await api.post('/ai/summarize', { owner, repo, sha });
      return response.data;
    } catch (error) {
      console.error('AI Summarization API Error:', error);
      throw error;
    }
  }
};

export default aiService;
