import React, { useEffect, useState, useCallback } from 'react';
import { useGlobalContext } from '../../context/GlobalContext';
import { githubService } from '../../api/githubService';
import './CommitSelector.css';

const CommitSelector = ({ onSelectCommit }) => {
  const { 
    repos, setRepos,
    selectedRepo, setSelectedRepo,
    branches, setBranches,
    selectedBranch, setSelectedBranch,
    commits, setCommits,
    selectedCommit, setSelectedCommit,
    isSyncing, setIsSyncing
  } = useGlobalContext();

  const [isLoading, setIsLoading] = useState(false);
  // owner 정보를 저장하기 위한 내부 상태 (또는 GlobalContext에 추가 가능)
  const [repoDetails, setRepoData] = useState([]);

  // 1. 초기 레포지토리 목록 로드 (중복 제거 로직 포함)
  const fetchRepos = useCallback(async () => {
    try {
      const data = await githubService.getRepositories();
      // 이름 기준으로 중복 제거
      const uniqueRepos = Array.from(new Map(data.map(item => [item.name, item])).values());
      setRepoData(uniqueRepos);
      setRepos(uniqueRepos.map(r => r.name));
    } catch (error) {
      console.error('Failed to fetch repositories:', error);
    }
  }, [setRepos]);

  useEffect(() => {
    if (repos.length === 0) fetchRepos();
  }, [fetchRepos, repos.length]);

  // 2. 레포지토리 선택 시 브랜치 로드
  const handleRepoChange = async (repoName) => {
    const repoInfo = repoDetails.find(r => r.name === repoName);
    if (!repoInfo) return;

    setSelectedRepo(repoName);
    setSelectedBranch("");
    setCommits([]);
    setIsLoading(true);
    try {
      const data = await githubService.getBranches(repoInfo.owner, repoName);
      setBranches(data.map(b => b.name));
    } catch (error) {
      console.error('Failed to fetch branches:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 3. 브랜치 선택 시 커밋 로드
  const handleBranchChange = async (branchName) => {
    const repoInfo = repoDetails.find(r => r.name === selectedRepo);
    if (!repoInfo) return;

    setSelectedBranch(branchName);
    setIsLoading(true);
    try {
      const data = await githubService.getCommits(repoInfo.owner, selectedRepo, branchName);
      setCommits(data);
    } catch (error) {
      console.error('Failed to fetch commits:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await githubService.syncData();
      alert('GitHub data synced successfully!');
      fetchRepos(); // 목록 갱신
    } catch (error) {
      alert('Failed to sync GitHub data.');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="commit-selector">
      <div className="selector-header">
        <h3>GitHub Explorer</h3>
      </div>
      
      <div className="selector-section">
        <label>Repository</label>
        <select 
          className="dark-select" 
          value={selectedRepo} 
          onChange={(e) => handleRepoChange(e.target.value)}
        >
          <option value="" disabled>Select a repository</option>
          {repos.map(repo => (
            <option key={repo} value={repo}>{repo}</option>
          ))}
        </select>
      </div>

      <div className="selector-section">
        <label>Branch</label>
        <select 
          className="dark-select" 
          value={selectedBranch} 
          onChange={(e) => handleBranchChange(e.target.value)}
          disabled={!selectedRepo}
        >
          <option value="" disabled>Select a branch</option>
          {branches.map(branch => (
            <option key={branch} value={branch}>{branch}</option>
          ))}
        </select>
      </div>

      <div className="commit-list-container">
        <label>Commits {isLoading && <span className="loading-small">(Loading...)</span>}</label>
        <div className="commit-list">
          {commits.length > 0 ? (
            commits.map(commit => (
              <div 
                key={commit.sha} 
                className={`commit-item ${selectedCommit?.sha === commit.sha ? 'active' : ''}`}
                onClick={() => onSelectCommit(commit)}
              >
                <span className="commit-message">{commit.message}</span>
                <span className="commit-date">{new Date(commit.date).toLocaleDateString()}</span>
              </div>
            ))
          ) : (
            <div className="empty-message">{selectedBranch ? 'No commits found.' : 'Select a branch first.'}</div>
          )}
        </div>
      </div>

      <button 
        className="sync-btn" 
        onClick={handleSync}
        disabled={isSyncing}
      >
        {isSyncing ? 'Syncing...' : 'Sync GitHub'}
      </button>
    </div>
  );
};

export default CommitSelector;
