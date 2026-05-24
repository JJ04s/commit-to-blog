import React, { createContext, useState, useContext } from 'react';
import { MOCK_REPOS, MOCK_COMMITS, MOCK_POSTS } from '../api/mockData';

// --- [GlobalContext] 전역 상태 관리를 위한 컨텍스트 생성 ---
const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  // A. 요약할 커밋 로그 선택 기능 관련 상태 (초기값으로 목데이터 주입)
  const [repos, setRepos] = useState(MOCK_REPOS.map(r => r.name));
  const [selectedRepo, setSelectedRepo] = useState("");
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [commits, setCommits] = useState(MOCK_COMMITS);
  const [selectedCommit, setSelectedCommit] = useState(null);

  // B. 편집기 및 생성 기능 관련 상태
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [tags, setTags] = useState([]);

  // C. 보기 및 필터 기능 관련 상태 (초기값으로 목데이터 주입)
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [repoFilter, setRepoFilter] = useState("전체");
  const [tagFilter, setTagFilter] = useState([]);

  // D. 레이아웃 및 화면 제어 관련 상태
  const [activeTab, setActiveTab] = useState("VIEW");
  const [editingPostId, setEditingPostId] = useState(null);

  // 상태와 변경 함수들을 하나의 객체로 묶음
  const value = {
    // A
    repos, setRepos,
    selectedRepo, setSelectedRepo,
    branches, setBranches,
    selectedBranch, setSelectedBranch,
    commits, setCommits,
    selectedCommit, setSelectedCommit,
    // B
    title, setTitle,
    content, setContent,
    isSummarizing, setIsSummarizing,
    isSyncing, setIsSyncing,
    tags, setTags,
    // C
    posts, setPosts,
    repoFilter, setRepoFilter,
    tagFilter, setTagFilter,
    // D
    activeTab, setActiveTab,
    editingPostId, setEditingPostId
  };

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
};

// 커스텀 훅: 컨텍스트를 편리하게 사용하기 위함
export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobalContext must be used within a GlobalProvider');
  }
  return context;
};

// --- [GlobalContext] 구현 종료 ---
