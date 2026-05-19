import React, { createContext, useState, useContext } from 'react';

// --- [GlobalContext] 전역 상태 관리를 위한 컨텍스트 생성 ---
const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  // A. 요약할 커밋 로그 선택 기능 관련 상태
  // Why: 사용자가 GitHub에서 데이터를 단계별로 선택하는 흐름을 추적하기 위함
  const [repos, setRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState("");
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [commits, setCommits] = useState([]);
  const [selectedCommit, setSelectedCommit] = useState(null);

  // B. 편집기 및 생성 기능 관련 상태
  // Why: AI 요약 결과물을 저장하고 로딩 상태를 사용자에게 보여주기 위함
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [tags, setTags] = useState([]);

  // C. 보기 및 필터 기능 관련 상태
  // Why: DB에서 가져온 포스트 목록과 사용자의 필터링 조건을 관리하기 위함
  const [posts, setPosts] = useState([]);
  const [repoFilter, setRepoFilter] = useState("전체");
  const [tagFilter, setTagFilter] = useState([]);

  // D. 레이아웃 및 화면 제어 관련 상태
  // Why: 탭 전환(VIEW/WRITE) 및 수정 모드 진입 여부를 제어하기 위함
  const [activeTab, setActiveTab] = useState("VIEW"); // 초기값 "VIEW"
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
