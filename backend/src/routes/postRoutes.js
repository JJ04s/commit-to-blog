const express = require('express');
const router = express.Router();
const postController = require('../controller/postController');

// --- [Post Routes] 포스트 API 엔드포인트 정의 ---
// Why: 프론트엔드에서 포스트 관리를 위해 호출할 REST API 경로 정의

// 포스트 생성
router.post('/', postController.createPost);

// 포스트 목록 조회 (예: /api/posts?tag=React)
router.get('/', postController.getPosts);

// 특정 SHA 기반 포스트 조회 (예: /api/posts/sha123)
router.get('/:sha', postController.getPostBySha);

// 포스트 수정 (ID 기반)
router.put('/:id', postController.updatePost);

// 포스트 삭제 (ID 기반)
router.delete('/:id', postController.deletePost);

module.exports = router;

// --- [Post Routes] 구현 종료 ---
