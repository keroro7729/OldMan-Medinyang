import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoadingPage from "./pages/LoadingPage";
import Main from "./pages/MainPage";
import ChatPage from "./pages/ChatPage";
import UploadPage from "./pages/UploadPage";
import HistoryPage from "./pages/HistoryPage";
import ManagePage from "./pages/ManagePage";
import { CatProvider } from "./context/CatContext"; // ✅ 추가

function App() {
  return (
    <CatProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoadingPage />} />
          <Route path="/main" element={<Main />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/manage" element={<ManagePage />} />
        </Routes>
      </Router>
    </CatProvider>
  );
}

export default App;
