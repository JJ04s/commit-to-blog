const aiService = require('../services/aiService');

// --- [AI Controller] 커밋 분석 및 요약 핸들러 ---
// Why: 특정 커밋의 변경 사항을 분석하여 블로그 초안(JSON)을 생성함

exports.summarizeCommit = async (req, res) => {
  try {
    const { owner, repo, sha } = req.body;

    if (!owner || !repo || !sha) {
      return res.status(400).json({ message: 'Missing required fields: owner, repo, and sha are mandatory.' });
    }

    // 1. 커밋 Diff 추출
    const diffText = await aiService.fetchCommitDiff(owner, repo, sha);

    // 2. Gemini를 이용한 요약 생성
    const draft = await aiService.generatePostDraft(diffText);

    res.status(200).json(draft);
  } catch (error) {
    console.error('AI Summary Error:', error);
    res.status(500).json({ message: error.message });
  }
};
