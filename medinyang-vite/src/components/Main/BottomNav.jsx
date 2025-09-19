// src/components/Main/BottomNav.jsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faChartLine,
  faFileMedical,
  faUserDoctor,
  faGear,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const BottomNav = ({ current }) => {
  const navigate = useNavigate();

  const navItems = [
    { icon: faChartLine, label: "나의 건강", to: "/data" },
    { icon: faFileMedical, label: "이력 관리", to: "/history" },
    { icon: faHouse, label: "홈", to: "/main" },
    { icon: faUserDoctor, label: "맞춤관리", to: "/manage" },
    { icon: faGear, label: "설정", to: "/setting" },
  ];

  return (
    <div style={styles.nav}>
      {navItems.map((item) => (
        <div
          key={item.to}
          onClick={() => navigate(item.to)}
          style={{
            ...styles.item,
            color: current === item.to.split("/")[1] ? "#3B82F6" : "#6B7280",
          }}
        >
          <FontAwesomeIcon icon={item.icon} size="lg" />
          <div style={styles.label}>{item.label}</div>
        </div>
      ))}
    </div>
  );
};

const styles = {
  nav: {
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "64px",
    backgroundColor: "#fff",
    borderTop: "1px solid #ddd",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    zIndex: 1000,
  },
  item: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontSize: "12px",
    cursor: "pointer",
  },
  label: {
    marginTop: "4px",
    whiteSpace: "pre-line",
    textAlign: "center",
  },
};

export default BottomNav;
