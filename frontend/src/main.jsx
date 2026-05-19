import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { GlobalProvider } from './context/GlobalContext'

// --- [App 초기화] 전역 상태(Context) 적용 ---
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GlobalProvider>
      <App />
    </GlobalProvider>
  </React.StrictMode>,
)
// --- [App 초기화] 구현 종료 ---
