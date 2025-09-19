import React, { useState } from "react";
import TopHeader from "../components/common/TopHeader";
import { useNavigate } from "react-router-dom";
import PlanResultCard from "../components/Manage/PlanResultCard";
import ChallengeContent from "../components/Manage/ChallengeContent";
import BottomNav from "../components/Main/BottomNav";


const ManagePage = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("plan");


  const handleGoToChat = () => {
    navigate("/chat");
  };

  return (
    <div style={styles.page}>
      <TopHeader title="맞춤 관리" />

      <div style={styles.tabContainer}>
        <button
          style={{ ...styles.tab, ...(tab === "plan" ? styles.activeTab : {}) }}
          onClick={() => setTab("plan")}
        >
          맞춤 플랜
        </button>
        <button
          style={{ ...styles.tab, ...(tab === "challenge" ? styles.activeTab : {}) }}
          onClick={() => setTab("challenge")}
        >
          챌린지
        </button>
      </div>

      <div style={styles.content}>
        {tab === "plan" ? (
          <>
            <button onClick={handleGoToChat} style={styles.consultButton}>
              플랜 상담하러 가기
            </button>
            <hr style={styles.divider} />
            <PlanResultCard />
          </>
        ) : (
          <ChallengeContent />
        )}
      </div>

      <BottomNav current="manage" />
    </div>
  );
};

const styles = {
  page: {
    width: "100vw",
    height: "100dvh",
    backgroundColor: "#f9f9f9",
    boxSizing: "border-box",
  },
  tabContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "12px",
    borderBottom: "1px solid #ddd",
  },
  tab: {
    flex: 1,
    padding: "12px 0",
    backgroundColor: "#f3f4f6",
    border: "none",
    fontWeight: "bold",
    color: "#6b7280",
    cursor: "pointer",
  },
  activeTab: {
    backgroundColor: "#ffffff",
    color: "#111827",
    borderBottom: "2px solid #3B82F6",
  },
  content: {
    padding: "16px",
  },
  consultButton: {
    width: "100%",
    padding: "16px",
    backgroundColor: "#BFDBFE",
    color: "#1D4ED8",
    fontWeight: "bold",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    marginBottom: "16px",
  },
  divider: {
    margin: "16px 0",
    border: "none",
    borderTop: "1px solid #e5e7eb",
  },
};

export default ManagePage;
