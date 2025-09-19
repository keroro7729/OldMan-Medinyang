// src/components/Main/ChallengeSummary.jsx
import React from "react";
import sleepyCat from "../../assets/goodnyang.png";
import { useNavigate } from "react-router-dom";

const ChallengeSummary = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.card} onClick={() => navigate("/manage?tab=challenge")}>
      {/* ✅ 상단 헤더: 좌우 색 다르게 분리 */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>🌙&nbsp;<span style={styles.headerTitle}>수면 챌린지</span></div>
        <div style={styles.headerRight}>챌린지 체크하러 가기 →</div>
      </div>

      <div style={styles.content}>
        <div>
          <p style={styles.status}>13일 연속 성공중 🔥</p>
          <p style={styles.desc}>지금 이 페이스 그대로~!<br /> 남은 기간 화이팅 👊🏻</p>
          <div style={styles.barWrapper}>
            <div style={styles.barFill} />
          </div>
          <p style={styles.date}>2025.05.01~2025.05.31</p>
        </div>
        <img src={sleepyCat} alt="챌린지" style={styles.cat} />
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: "#fff",
    borderRadius: "16px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    overflow: "hidden", // ✅ 헤더 색 분할 유지
  },
  header: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    height: "40px",
  },
  headerLeft: {
    flex: 1,
    backgroundColor: "#1E3A8A",
    color: "white",
    fontWeight: "bold",
    paddingLeft: "16px",
    display: "flex",
    alignItems: "center",
    fontSize: "15px",
  },
  headerRight: {
    backgroundColor: "#1E3A8A",
    color: "white",
    fontSize: "12px",
    padding: "0 12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  headerTitle: {
    marginLeft: "4px",
  },
  content: {
    padding: "14px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "14px",
    marginLeft:"15px",
  },
  status: {
    fontSize: "15px",
    fontWeight: "bold",
    marginBottom: "6px",
  },
  desc: {
    marginTop: "-3px",
    fontSize: "12px",
    color: "#444",
    marginBottom: "20px",
  },
  barWrapper: {
    width: "150px",
    height: "10px",
    backgroundColor: "#E5E7EB",
    borderRadius: "6px",
    overflow: "hidden",
    marginBottom: "6px",
  },
  barFill: {
    width: "65%",
    height: "100%",
    backgroundColor: "#3B82F6",
  },
  date: {
    marginTop: "-2px",
    fontSize: "12px",
    color: "#6B7280",
  },
  cat: {
    width: "130px",
    height: "auto",
    marginRight: "2px"
  },
};

export default ChallengeSummary;
