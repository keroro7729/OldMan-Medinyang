// src/components/common/TopHeader.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

// TopHeader 컴포넌트
// title: 가운데 제목 텍스트
// backTo: 뒤로가기 버튼을 눌렀을 때 이동할 경로 (없으면 이전 페이지로)
const TopHeader = ({ title = "제목 없음", backTo = null }) => {
  const navigate = useNavigate();

  // 뒤로가기 버튼 클릭 시 실행
  const handleBack = () => {
    if (backTo) {
      navigate(backTo); // 지정한 경로로 이동
    } else {
      navigate(-1); // 이전 페이지로 이동
    }
  };

  return (
    <div
      style={{
        position: "sticky",      // ✅ 스크롤 고정
        top: 0,                  // ✅ 최상단 고정
        zIndex: 100,            // ✅ 다른 요소보다 위에
        width: "100%",
        display: "flex",
        backgroundColor: "#ffffff",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* 왼쪽 뒤로가기 버튼 */}
      <button
        onClick={handleBack}
        style={{
          backgroundColor: "#ffffff",
          color: "#3B82F6",
          fontWeight: "bold",
          fontSize: "20px",
          padding: "4px",
          borderRadius: "6px",
          border: "none",
          cursor: "pointer",
          marginLeft: "20px",
          transition: "color 0.2s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#1D4ED8")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#3B82F6")}
      >
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>

      {/* 가운데 타이틀 */}
      <h2
        style={{
          fontSize: "16px",
          fontWeight: "600",
          fontFamily: `'Segoe UI', 'Pretendard', 'Noto Sans KR', sans-serif`,
          color: "#111827",
        }}
      >
        {title}
      </h2>

      {/* 오른쪽 여백: 균형 맞추기용 (아이콘 자리) */}
      <div style={{ width: "40px" }} />
    </div>
  );
};

export default TopHeader;
