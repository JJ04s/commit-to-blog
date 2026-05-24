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
      const safeDiffText = typeof diffText === 'string' ? diffText : JSON.stringify(diffText);
      
      // JSON 모드와 스키마 설정을 통해 파싱 에러를 근본적으로 방지합니다.
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              title: { type: "string" },
              content: { type: "string" },
              tags: { type: "array", items: { type: "string" } }
            },
            required: ["title", "content", "tags"]
          }
        }
      });

      const prompt = `
당신은 코드를 분석하여 깊이 있는 기술적 통찰을 제공하는 시니어 개발자이자 교육자입니다.
아래의 GitHub 커밋 Diff 데이터를 분석하여 사용자의 학습을 위한 **'흐름 중심 기술 회고록'** 초안을 작성해주세요.

[필수 분석 구조: Logical Flow]
1. 배경 및 기반 (Foundation): 왜 이 작업이 시작되었는지(문제 제기)와 필요한 사전 기술 지식.
2. 구현 접근 방식 및 전개 (Approach): 
   - **능동적 브릿징(Logical Bridging)**: 코드 변경 사항 사이의 인과관계를 설명하고, 특정 수정이 왜 목표 달성을 위해 필요한지 기술적 근거 제시.
   - **도입 기술의 핵심 원리**: 사용된 라이브러리/스택의 원리가 구현에 어떻게 적용되었는지 상세 설명.
3. 심화 및 결론 (Convergence): 구현 결과의 가치와 이 과정을 통해 얻은 최종 기술적 결론 및 인사이트.

[준수 사항]
- 흐름 중심 요약: 지엽적인 코드 나열보다 전체적인 **논리적 전개 방식**에 집중할 것.
- 도약 없는 설명: 로직 사이의 공백을 기초 원리로 메워 누구나 흐름을 따라갈 수 있게 할 것.
- 톤앤매너: 전문적이고 정갈한 개발자용 문체 (Atom One Dark 테마 감성).
- 형식: 마크다운(Markdown) 형식을 사용할 것.

[Diff 데이터]
${safeDiffText.substring(0, 5000)}
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        return JSON.parse(text);
      } catch (parseError) {
        console.error("--- Raw AI Response (Debug) ---");
        console.error(text);
        console.error("-------------------------------");
        throw new Error(`JSON Parsing failed at pos ${parseError.message.match(/\d+/)}: ${parseError.message}`);
      }
    } catch (error) {
      throw new Error(`AI Generation failed: ${error.message}`);
    }
  }
};

module.exports = aiService;
// --- [AI Service] 구현 종료 ---
