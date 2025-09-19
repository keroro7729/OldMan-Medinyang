// ✅ ManagePage.jsx
import React, { useState } from "react";
import TopHeader from "../components/TopHeader";
import BottomNav from "../components/BottomNav";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ManagePage = () => {
  const [activeTab, setActiveTab] = useState("전체");

  // ✅ 체중 더미데이터
  const weightData = [
    { date: "09-01", weight: 70 },
    { date: "09-05", weight: 71 },
    { date: "09-10", weight: 70.5 },
    { date: "09-15", weight: 69.8 },
    { date: "09-20", weight: 70.2 },
  ];

  // ✅ 주간 요약 더미데이터
  const weeklySummary = [
    "요즘 머리가 자주 아픔",
    "수면 시간이 불규칙함",
    "카페인 섭취가 잦음",
    "생활습관 개선 필요 → 규칙적인 수면, 물 섭취 권장",
  ];

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        {/* 상단 헤더 */}
        <TopHeader title="나의 건강 DATA" />

        {/* 탭 전환 */}
        <div style={styles.tabContainer}>
          <button
            style={{
              ...styles.tabButton,
              ...(activeTab === "전체" ? styles.activeTab : {}),
            }}
            onClick={() => setActiveTab("전체")}
          >
            전체
          </button>
          <button
            style={{
              ...styles.tabButton,
              ...(activeTab === "주간" ? styles.activeTab : {}),
            }}
            onClick={() => setActiveTab("주간")}
          >
            주간
          </button>
        </div>

        {/* 콘텐츠 */}
        <div style={styles.contentArea}>
          {activeTab === "전체" ? (
            <>
              {/* ✅ 체중 차트 */}
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>체중 변화 추이</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={weightData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[68, 72]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="weight" stroke="#3B82F6" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* ✅ AI 리포트 */}
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>AI 리포트</h3>
                <p style={styles.reportText}>
                  최근 체중 변화는 안정적입니다. 건강한 생활습관을 유지하고
                  있습니다. <br />
                  앞으로는 수분 섭취와 충분한 수면을 신경 쓰면 더 좋습니다.
                </p>
              </div>
            </>
          ) : (
            <>
              {/* ✅ 주간 요약 */}
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>주간 건강 요약</h3>
                <ul>
                  {weeklySummary.map((item, idx) => (
                    <li key={idx} style={styles.reportText}>
                      - {item}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>

        {/* 하단 네비게이션 */}
        <div style={styles.bottomNavWrapper}>
          <BottomNav current="manage" />
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    minHeight: "100vh",
    backgroundColor: "#D1E3FF",
  },
  container: {
    position: "relative",
    maxWidth: "430px",
    width: "100%",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
    display: "flex",
    flexDirection: "column",
    paddingBottom: "80px", // 네비게이션 여백
  },
  tabContainer: {
    display: "flex",
    gap: "8px",
    padding: "12px 20px",
  },
  tabButton: {
    flex: 1,
    padding: "8px",
    borderRadius: "20px",
    border: "1px solid #ccc",
    background: "#f5f5f5",
    cursor: "pointer",
    fontSize: "14px",
  },
  activeTab: {
    background: "#3B82F6",
    color: "#fff",
    border: "1px solid #3B82F6",
  },
  contentArea: {
    flex: 1,
    overflowY: "auto",
    padding: "16px 20px",
  },
  card: {
    background: "#fff",
    borderRadius: "12px",
    padding: "16px",
    marginBottom: "16px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
  },
  cardTitle: {
    marginBottom: "8px",
    fontSize: "16px",
    fontWeight: "bold",
  },
  reportText: {
    fontSize: "14px",
    color: "#333",
    lineHeight: "1.4",
  },
  bottomNavWrapper: {
    position: "fixed",
    bottom: 0,
    left: "50%",
    transform: "translateX(-50%)",
    width: "100%",
    maxWidth: "430px",
    zIndex: 30,
  },
};

export default ManagePage;
