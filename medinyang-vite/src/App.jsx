import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./pages/MainPage";
import ChatPage from "./pages/ChatPage";
import UploadPage from "./pages/UploadPage";
import HistoryPage from "./pages/HistoryPage";
import ManagePage from "./pages/ManagePage";
import LoginPage from "./pages/LoginPage";
import { CatProvider } from "./context/CatContext"; // ✅ 추가
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <CatProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/main" element={<Main />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/manage" element={<ManagePage />} />
          </Routes>
        </Router>
      </CatProvider>
    </AuthProvider>
  );
}

export default App;
