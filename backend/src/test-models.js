const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Post = require('./models/Post');
const Repository = require('./models/Repository');
const Branch = require('./models/Branch');
const Commit = require('./models/Commit');

// 환경 변수 로드
dotenv.config();

const testModels = async () => {
  try {
    // 1. DB 연결
    await connectDB();
    console.log('--- Model Validation Start ---');

    // 2. Repository 테스트
    const repo = await Repository.create({
      name: 'test-repo',
      owner: 'test-user'
    });
    console.log('✅ Repository Model Verified');

    // 3. Branch 테스트
    const branch = await Branch.create({
      name: 'main',
      repoId: repo._id
    });
    console.log('✅ Branch Model Verified');

    // 4. Commit 테스트
    const commit = await Commit.create({
      sha: '1234567890abcdef',
      message: 'test commit',
      date: new Date(),
      branchId: branch._id
    });
    console.log('✅ Commit Model Verified');

    // 5. Post 테스트
    const post = await Post.create({
      title: 'Test Post',
      content: 'This is a test content',
      tags: ['test', 'node'],
      repoName: 'test-user/test-repo',
      commitSha: '1234567890abcdef',
      githubUrl: 'https://github.com/test-user/test-repo/commit/1234567890abcdef'
    });
    console.log('✅ Post Model Verified');

    console.log('--- All Models Verified Successfully ---');

    // 테스트 데이터 삭제 (Cleanup)
    await Post.findByIdAndDelete(post._id);
    await Commit.findByIdAndDelete(commit._id);
    await Branch.findByIdAndDelete(branch._id);
    await Repository.findByIdAndDelete(repo._id);
    console.log('🧹 Test Data Cleaned Up');

    process.exit(0);
  } catch (error) {
    console.error(`❌ Model Verification Failed: ${error.message}`);
    process.exit(1);
  }
};

testModels();
