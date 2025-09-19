// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UploadPage from "./pages/UploadPage";
import ChatPage from "./pages/ChatPage";
import DataPage from './pages/DataPage';
import HistoryPage from "./pages/HistoryPage";
import EditBasicPage from './pages/EditBasicPage';
import ManagePage from './pages/ManagePage';
import SettingsPage from './pages/SettingsPage';
import MainPage from './pages/MainPage';
import LoginPage from "./pages/LoginPage";
import AddUserPage from "./pages/AddUserPage";
import HistoryDetailPage from "./pages/HistoryDetailPage";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./routes/PrivateRoute"; // ✅ 추가

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ✅ 공개 라우트 */}
          <Route path="/" element={<LoginPage />} />

          {/* ✅ 보호된 라우트 */}
          <Route path="/data" element={<PrivateRoute><DataPage /></PrivateRoute>} />
          <Route path="/upload" element={<PrivateRoute><UploadPage /></PrivateRoute>} />
          <Route path="/chat" element={<PrivateRoute><ChatPage /></PrivateRoute>} />
          <Route path="/edit-basic" element={<PrivateRoute><EditBasicPage /></PrivateRoute>} />
          <Route path="/history" element={<PrivateRoute><HistoryPage /></PrivateRoute>} />
          <Route path="/manage" element={<PrivateRoute><ManagePage /></PrivateRoute>} />
          <Route path="/setting" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
          <Route path="/main" element={<PrivateRoute><MainPage /></PrivateRoute>} />
          <Route path="/history/:id" element={<PrivateRoute><HistoryDetailPage /></PrivateRoute>} />
          <Route path="/add-user" element={<PrivateRoute><AddUserPage /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
