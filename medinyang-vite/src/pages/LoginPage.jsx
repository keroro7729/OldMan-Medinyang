// src/pages/LoginPage.jsx
import React from "react";
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

const LoginPage = () => {
  const handleLogin = () => {
    // 프록시를 타기 위해 '상대 경로' 사용
    window.location.assign(`${API_BASE}/oauth2/authorization/google`);
  };

  return (
    <div
      style={{
        height: "100dvh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        textAlign: "center",
      }}
    >
      <img src="src/assets/logo.png" alt="Medi냥 로고" style={{ width: 180 }} />
      <p style={{ fontSize: 14, marginBottom: 40 }}>
        메디냥과 함께 건강한 생활을 시작해보세요!
      </p>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          margin: "24px 0",
          width: "100%",
          maxWidth: 300,
        }}
      >
        <div style={{ flex: 1, height: 1, backgroundColor: "#ccc" }} />
        <span style={{ fontSize: 14, color: "#555", whiteSpace: "nowrap" }}>
          소셜 로그인
        </span>
        <div style={{ flex: 1, height: 1, backgroundColor: "#ccc" }} />
      </div>

      <button
        onClick={handleLogin}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          border: "1px solid #ddd",
          background: "#fff",
          padding: "10px 16px",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt=""
          width={18}
          height={18}
        />
        Google 계정으로 로그인
      </button>
    </div>
  );
};

export default LoginPage;
