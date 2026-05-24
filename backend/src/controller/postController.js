const Post = require('../models/Post');

// --- [Post Controller] 포스트 CRUD 로직 ---
// Why: 블로그 포스트의 생성, 조회, 수정, 삭제를 담당하는 비즈니스 로직

// 1. 포스트 생성 (Create)
exports.createPost = async (req, res) => {
  try {
    const { title, content, tags, repoName, commitSha, githubUrl } = req.body;
    
    // 필수 필드 체크 (docs/db-schema.md 기준)
    if (!title || !content || !repoName || !commitSha) {
      return res.status(400).json({ message: 'Missing required fields: title, content, repoName, and commitSha are mandatory.' });
    }

    const post = new Post({
      title,
      content,
      tags,
      repoName,
      commitSha,
      githubUrl
    });

    const savedPost = await post.save();
    res.status(201).json(savedPost);
  } catch (error) {
    if (error.code === 11000) { // 중복된 commitSha 처리
      return res.status(400).json({ message: 'A post for this commit SHA already exists.' });
    }
    res.status(500).json({ message: error.message });
  }
};

// 2. 포스트 목록 조회 (Read - List)
// Query Params: ?tag=xxx&repo=xxx
exports.getPosts = async (req, res) => {
  try {
    const { tag, repo } = req.query;
    let query = {};
    
    if (tag) query.tags = tag;
    if (repo) query.repoName = repo;

    const posts = await Post.find(query).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. 특정 포스트 조회 (Read - Single by SHA)
exports.getPostBySha = async (req, res) => {
  try {
    const post = await Post.findOne({ commitSha: req.params.sha });
    if (!post) {
      return res.status(404).json({ message: 'Post not found for the given SHA.' });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. 포스트 수정 (Update)
exports.updatePost = async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found.' });
    }
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 5. 포스트 삭제 (Delete)
exports.deletePost = async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost) {
      return res.status(404).json({ message: 'Post not found.' });
    }
    res.status(200).json({ message: 'Post successfully deleted.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- [Post Controller] 구현 종료 ---
