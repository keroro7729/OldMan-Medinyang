// src/components/BottomNav.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaw,
  faCommentDots,
  faFolder,
  faChartBar,
} from "@fortawesome/free-solid-svg-icons";

const BottomNav = ({ current }) => {
  const navigate = useNavigate();

  return (
    <div className="bottom-nav">
      {/* 메인 */}
      <button
        onClick={() => navigate("/main")}
        className={`nav-btn ${current === "main" ? "active" : ""}`}
      >
        <FontAwesomeIcon icon={faPaw} size="lg" />
      </button>

      {/* 챗 */}
      <button
        onClick={() => navigate("/chat")}
        className={`nav-btn ${current === "chat" ? "active" : ""}`}
      >
        <FontAwesomeIcon icon={faCommentDots} size="lg" />
      </button>

      {/* 업로드 */}
      <button
        onClick={() => navigate("/history")}
        className={`nav-btn ${current === "history" ? "active" : ""}`}
      >
        <FontAwesomeIcon icon={faFolder} size="lg" />
      </button>

      {/* 맞춤관리 */}
      <button
        onClick={() => navigate("/manage")}
        className={`nav-btn ${current === "manage" ? "active" : ""}`}
      >
        <FontAwesomeIcon icon={faChartBar} size="lg" />
      </button>

      {/* ✅ CSS-in-JS */}
      <style>{`
        .bottom-nav {
          height: 64px;
          background: white;
          display: flex;
          justify-content: space-around;
          align-items: center;
          box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.1);
        }
        .nav-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #666;
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1;
        }
        .nav-btn.active {
          color: #2C7EDB; /* ✅ 활성화된 페이지 색상 */
        }
      `}</style>
    </div>
  );
};

export default BottomNav;
