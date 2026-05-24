import React from 'react';
import './CommitSelector.css';

const CommitSelector = ({ repositories = [], commits = [], onSelectCommit }) => {
  return (
    <div className="commit-selector">
      <div className="selector-header">
        <h3>GitHub Explorer</h3>
      </div>
      
      <div className="selector-section">
        <label>Repository</label>
        <select className="dark-select">
          {repositories.map(repo => (
            <option key={repo} value={repo}>{repo}</option>
          ))}
        </select>
      </div>

      <div className="selector-section">
        <label>Branch</label>
        <select className="dark-select">
          <option>main</option>
          <option>develop</option>
        </select>
      </div>

      <div className="commit-list-container">
        <label>Commits</label>
        <div className="commit-list">
          {commits.length > 0 ? (
            commits.map(commit => (
              <div 
                key={commit.sha} 
                className="commit-item"
                onClick={() => onSelectCommit(commit)}
              >
                <span className="commit-message">{commit.message}</span>
                <span className="commit-date">{new Date(commit.date).toLocaleDateString()}</span>
              </div>
            ))
          ) : (
            <div className="empty-message">No commits found.</div>
          )}
        </div>
      </div>

      <button className="sync-btn">Sync GitHub</button>
    </div>
  );
};

export default CommitSelector;
