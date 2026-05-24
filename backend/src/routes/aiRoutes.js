const express = require('express');
const router = express.Router();
const aiController = require('../controller/aiController');

// 커밋 요약 생성
router.post('/summarize', aiController.summarizeCommit);

module.exports = router;
