const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// --- [AI Service] AI 요약 및 Diff 추출 로직 ---
// Why: 커밋의 기술적 변경 사항을 분석하여 사용자 취향에 맞는 블로그 초안을 생성함
// gemini/GEMINI.md의 논리적 전개 방식과 plan.md 4.1의 요약 로직을 반영함

const github = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    'Accept': 'application/vnd.github.v3+diff' // Diff 형식을 받기 위한 헤더
  }
});

github.interceptors.request.use(config => {
  const token = process.env.GITHUB_PAT;
  if (token) {
    config.headers.Authorization = `token ${token}`;
  }
  return config;
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const aiService = {
  /**
   * 1. 커밋 Diff 추출
   * @param {string} owner - 리포지토리 소유자
   * @param {string} repo - 리포지토리 이름
   * @param {string} sha - 커밋 SHA
   */
  fetchCommitDiff: async (owner, repo, sha) => {
    try {
      const response = await github.get(`/repos/${owner}/${repo}/commits/${sha}`, {
        responseType: 'text' // 명시적으로 텍스트 응답을 요청
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch diff: ${error.message}`);
    }
  },

  /**
   * 2. Gemini를 이용한 블로그 초안 생성
   * @param {string} diffText - 커밋 Diff 데이터
   */
  generatePostDraft: async (diffText) => {
    try {
      // 인자가 문자열이 아니면 문자열로 변환 (안전장치)
      const safeDiffText = typeof diffText === 'string' ? diffText : JSON.stringify(diffText);
      const model = genAI.getGenerativeModel({ model: "models/gemini-2.0-flash" });

      const prompt = `
당신은 숙련된 시니어 개발자이자 기술 블로거입니다. 
아래의 GitHub 커밋 Diff 데이터를 분석하여 개발 블로그 포스트 초안을 작성해주세요.

[준수 사항]
1. 논리적 전개: '배경 지식/문제 제기 -> 주요 작업 내용 -> 결론 및 기대 효과' 순서로 작성할 것.
2. 상세한 연결고리: 단순히 수정한 내용을 나열하지 말고, 왜 이 수정을 했는지와 이 수정이 어떤 결과로 이어지는지 논리적으로 설명할 것.
3. 톤앤매너: 전문적이면서도 친절한 개발자 블로그 말투 (Atom One Dark 테마의 정갈한 느낌).
4. 형식: 마크다운(Markdown) 형식을 사용할 것.
5. 응답 구조: 반드시 아래 JSON 형식으로 응답할 것.
{
  "title": "포스트 제목",
  "content": "마크다운 본문",
  "tags": ["기술스택1", "작업유형", "..."]
}

[Diff 데이터]
${safeDiffText.substring(0, 5000)}
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // JSON 응답 추출 (코드 블록 제거 등)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Failed to parse AI response as JSON");
      
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      throw new Error(`AI Generation failed: ${error.message}`);
    }
  }
};

module.exports = aiService;
// --- [AI Service] 구현 종료 ---
