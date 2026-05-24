import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './component/Layout/Layout';
import ViewPage from './page/ViewPage/ViewPage';
import WritePage from './page/WritePage/WritePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {/* 기본 경로는 목록 페이지로 이동 */}
          <Route path="/" element={<Navigate to="/view" replace />} />
          
          {/* 보기 탭 페이지 */}
          <Route path="/view" element={<ViewPage />} />
          
          {/* 작성 탭 페이지 */}
          <Route path="/write" element={<WritePage />} />
        </Route>
        
        {/* 정의되지 않은 경로는 다시 목록으로 */}
        <Route path="*" element={<Navigate to="/view" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
