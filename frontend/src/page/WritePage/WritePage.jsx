import React, { useState } from 'react';
import CommitSelector from '../../component/CommitSelector/CommitSelector';
import PostEditor from '../../component/PostEditor/PostEditor';
import { getMockRepositories, MOCK_POSTS } from '../../api/mockData';
import './WritePage.css';

const WritePage = () => {
  const [selectedCommit, setSelectedCommit] = useState(null);
  const repositories = getMockRepositories();
  
  // 목데이터에서 커밋 리스트 추출 (간단하게 MOCK_POSTS 활용)
  const mockCommits = MOCK_POSTS.map(post => ({
    sha: post.commitSha,
    message: post.title,
    date: post.createdAt
  }));

  const handleSelectCommit = (commit) => {
    setSelectedCommit(commit);
  };

  return (
    <div className="write-page">
      <div className="write-container">
        <aside className="commit-sidebar">
          <CommitSelector 
            repositories={repositories} 
            commits={mockCommits}
            onSelectCommit={handleSelectCommit}
          />
        </aside>
        
        <main className="editor-area">
          <PostEditor 
            initialData={selectedCommit ? {
              sha: selectedCommit.sha,
              title: selectedCommit.message,
              content: `Summary for commit: ${selectedCommit.sha}\n\nThis is an auto-generated placeholder content.`
            } : {}} 
          />
        </main>
      </div>
    </div>
  );
};

export default WritePage;
