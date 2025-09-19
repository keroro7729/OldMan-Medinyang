// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoadingPage from "./pages/LoadingPage";
import Main from "./pages/MainPage";
import ChatPage from "./pages/ChatPage";
import UploadPage from "./pages/UploadPage";
import HistoryPage from "./pages/HistoryPage";
import ManagePage from "./pages/ManagePage";

function App() {
  return (
    <Router>
      <Routes>
        {/* 앱 진입 시 퍼스트 로딩 페이지 */}
        <Route path="/" element={<LoadingPage />} />
        <Route path="/main" element={<Main />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/manage" element={<ManagePage />} />
      </Routes>
    </Router>
  );
}

export default App;
