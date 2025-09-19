import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const TopHeader = ({ title = "메디냥 AI" }) => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        height: "56px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center", // ✅ 중앙 정렬
        position: "relative", // 버튼과 타이틀을 겹치지 않게
        backgroundColor: "transparent",
        boxSizing: "border-box",
      }}
    >
      {/* 뒤로가기 버튼 (왼쪽 고정) */}
      <button
        onClick={() => navigate(-1)}
        style={{
          position: "absolute",
          left: "16px", // ✅ 항상 왼쪽에 고정
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#2C7EDB",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "20px",
          height: "17.26px",
        }}
      >
        <FontAwesomeIcon icon={faArrowLeft} size="lg" />
      </button>

      {/* 타이틀 (중앙) */}
      <h1
        style={{
          fontFamily: "'Noto Sans KR', sans-serif",
          fontWeight: 600,
          fontSize: "20px",
          color: "#000000",
          margin: 0,
        }}
      >
        {title}
      </h1>
    </div>
  );
};

export default TopHeader;
