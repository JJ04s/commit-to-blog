import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ViewPage from './page/ViewPage';
import WritePage from './page/WritePage';

// --- [App 라우팅] 페이지별 주소 설정 ---
// Why: 사용자가 목록 보기(VIEW)와 포스트 작성(WRITE)을 URL 주소 기반으로 이동하게 함
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 기본 경로는 목록 페이지로 이동 */}
        <Route path="/" element={<Navigate to="/view" replace />} />
        
        {/* 보기 탭 페이지 */}
        <Route path="/view" element={<ViewPage />} />
        
        {/* 작성 탭 페이지 */}
        <Route path="/write" element={<WritePage />} />
        
        {/* 정의되지 않은 경로는 다시 목록으로 */}
        <Route path="*" element={<Navigate to="/view" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
// --- [App 라우팅] 구현 종료 ---
