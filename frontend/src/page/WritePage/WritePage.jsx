import React from 'react';
import CommitSelector from '../../component/CommitSelector/CommitSelector';
import PostEditor from '../../component/PostEditor/PostEditor';
import { useGlobalContext } from '../../context/GlobalContext';
import './WritePage.css';

const WritePage = () => {
  const { 
    repos, 
    commits, 
    selectedCommit, 
    setSelectedCommit 
  } = useGlobalContext();

  const handleSelectCommit = (commit) => {
    setSelectedCommit(commit);
  };

  return (
    <div className="write-page">
      <div className="write-container">
        <aside className="commit-sidebar">
          <CommitSelector 
            repositories={repos} 
            commits={commits}
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
