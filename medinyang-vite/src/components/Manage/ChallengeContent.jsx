// src/components/Manage/ChallengeContent.jsx
import React, { useState } from "react";
import successCat from "../../assets/goodnyang.png";
import failCat from "../../assets/tirednyang.png";

const ChallengeContent = () => {
  const [isSuccess, setIsSuccess] = useState(true);

  const challenge = isSuccess
    ? { streak: 13, rate: 97, img: successCat }
    : { streak: 3, rate: 12, img: failCat };

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>🌙 수면 챌린지</h3>
      <img src={challenge.img} alt="챌린지 상태" style={styles.image} />

      <div style={styles.buttonGroup}>
        <button style={styles.successBtn} onClick={() => setIsSuccess(true)}>성공</button>
        <button style={styles.failBtn} onClick={() => setIsSuccess(false)}>실패</button>
      </div>

      <div style={styles.stats}>
        <span>연속 {challenge.streak}일째 💤</span>
        <span>달성률 : {challenge.rate}%</span>
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: "#ffffff",
    padding: "32px 20px",
    borderRadius: "16px",
    textAlign: "center",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    minHeight: "360px",
  },
  title: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "16px",
  },
  image: {
    width: "120px",
    marginBottom: "20px",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    gap: "16px",
    marginBottom: "20px",
  },
  successBtn: {
    backgroundColor: "#BFDBFE",
    color: "#1D4ED8",
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  failBtn: {
    backgroundColor: "#FECACA",
    color: "#B91C1C",
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  stats: {
    display: "flex",
    justifyContent: "space-around",
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151",
  },
};

export default ChallengeContent;
