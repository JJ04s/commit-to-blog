const mongoose = require('mongoose');

// --- [Branch Model] GitHub 브랜치 캐시 스키마 ---
// Why: GitHub API 호출 최적화를 위한 계층 구조 캐싱 (docs/db-schema.md 준수)
const branchSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  repoId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Repository', 
    required: true 
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Branch', branchSchema);
// --- [Branch Model] 구현 종료 ---
