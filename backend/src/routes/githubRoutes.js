const express = require('express');
const router = express.Router();
const githubController = require('../controller/githubController');

// 리포지토리 목록
router.get('/repos', githubController.getRepos);

// 브랜치 목록
router.get('/branches/:owner/:repo', githubController.getBranches);

// 커밋 목록
router.get('/commits/:owner/:repo/:branch', githubController.getCommits);

module.exports = router;
