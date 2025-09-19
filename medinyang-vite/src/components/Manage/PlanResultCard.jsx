// src/components/PlanResultCard.jsx
import React from "react";
import catImage from "../../assets/plannyang.png"; // 경로는 실제에 맞게 조정

const PlanResultCard = () => {
  return (
    <div style={styles.card}>
      <div style={styles.text}>사용자 맞춤형<br />플랜 제공</div>
      <img src={catImage} alt="메디냥" style={styles.image} />
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "40px 20px",
    textAlign: "center",
    position: "relative",
    minHeight: "240px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  },
  text: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#111827",
  },
  image: {
    position: "absolute",
    right: "20px",
    bottom: "20px",
    width: "80px",
    height: "auto",
  },
};

export default PlanResultCard;
