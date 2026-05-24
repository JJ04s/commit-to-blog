const mongoose = require('mongoose');

// --- [Repository Model] GitHub 리포지토리 캐시 스키마 ---
// Why: GitHub API 호출 최적화를 위한 계층 구조 캐싱 (docs/db-schema.md 준수)
const repositorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  owner: { 
    type: String, 
    required: true 
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Repository', repositorySchema);
// --- [Repository Model] 구현 종료 ---
