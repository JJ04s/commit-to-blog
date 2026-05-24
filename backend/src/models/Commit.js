const mongoose = require('mongoose');

// --- [Commit Model] GitHub 커밋 캐시 스키마 ---
// Why: GitHub API 호출 최적화를 위한 계층 구조 캐싱 (docs/db-schema.md 준수)
const commitSchema = new mongoose.Schema({
  sha: { 
    type: String, 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  date: { 
    type: Date, 
    required: true 
  },
  branchId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Branch', 
    required: true 
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Commit', commitSchema);
// --- [Commit Model] 구현 종료 ---
