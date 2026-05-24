const mongoose = require('mongoose');

// --- [Post Model] 블로그 포스트 데이터 스키마 ---
// Why: 사용자가 AI 요약을 거쳐 편집 및 저장한 최종 블로그 게시물 데이터 (docs/db-schema.md 준수)
const postSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  tags: { 
    type: [String], 
    default: [] 
  },
  repoName: { 
    type: String, 
    required: true 
  },
  commitSha: { 
    type: String, 
    required: true, 
    unique: true 
  },
  githubUrl: { 
    type: String 
  }
}, {
  timestamps: true // docs 기준: createdAt, updatedAt 포함
});

module.exports = mongoose.model('Post', postSchema);
// --- [Post Model] 구현 종료 ---
