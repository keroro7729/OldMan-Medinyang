import React from "react";

// ✅ 의료 이력 리스트 컴포넌트
const HistoryList = ({ data, onItemClick }) => {
  // 데이터가 없을 경우 메시지 표시
  if (!data.length) {
    return (
      <p style={{ textAlign: "center", color: "#999", marginTop: "20px" }}>
        기록이 없습니다.
      </p>
    );
  }

  return (
    <div>
      {data.map((item, idx) => (
        <div
          key={idx}
          onClick={() => onItemClick?.(item.id)} // ✅ 항목 클릭 시 상세보기 페이지로 이동
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            padding: "16px",
            marginBottom: "16px",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.06)", // 살짝 그림자
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            cursor: "pointer",                      // 마우스 올리면 클릭 느낌
            transition: "transform 0.1s ease-in-out",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.01)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
        >
          {/* ✅ 왼쪽: 병원 정보 및 방문 일자 */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "13px", color: "#888" }}>{item.type}</div>
            <div
              style={{
                fontWeight: "bold",
                fontSize: "17px",
                color: "#2f80ed",
              }}
            >
              {item.hospital}
            </div>
            <div style={{ fontSize: "14px", color: "#555", marginTop: "4px" }}>
              {item.date}
            </div>
          </div>

          {/* ✅ 오른쪽: AI 분석 요약 결과 */}
          <div
            style={{
              flex: 1.5,
              paddingLeft: "12px",
              borderLeft: "2px solid #e0e0e0",  // 구분선
              paddingTop: "2px",
              paddingBottom: "2px",
            }}
          >
            <div
              style={{
                fontSize: "13px",
                color: "#888",
                marginBottom: "4px",
              }}
            >
              {item.type ? "AI 요약" : ""}
            </div>

            <div
              style={{
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              {item.diagnosis}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HistoryList;
