// ✅ src/pages/LoginPage.jsx
// ──────────────────────────────────────────────────────────────
// [기능 개요]
// - Google OAuth2 로그인을 위한 단일 진입 페이지.
// - 버튼 클릭 시 백엔드(Spring Security OAuth2 Client)의
//   `/oauth2/authorization/google` 엔드포인트로 리다이렉트한다.
//
// [인증 구조]
// ┌───────────────────────────────┐
// │  프론트엔드 (Vite + React)    │
// │  /login 페이지                │
// │   ↓ window.location.assign()  │
// │  백엔드 OAuth2 엔드포인트     │
// │   (/oauth2/authorization/google)
// │   ↓ 구글 인증 → redirect_uri  │
// │   ↓ 세션 생성 (JSESSIONID)    │
// └───────────────────────────────┘
// 이후 클라이언트는 세션 쿠키(JSESSIONID)를 이용해
// API 요청 시 인증을 유지(`credentials: 'include'`)한다.
//
// [보안 고려사항]
// - 절대 URL이 아닌 상대 경로(`/oauth2/...`)로 호출 시,
//   Vite dev server 프록시 설정이 적용되어 CORS 오류를 피할 수 있다.
// - 배포 시에는 .env의 `VITE_API_BASE_URL`을 이용해 백엔드 URL 자동 주입.
//
// [관련 구성요소]
// - AuthContext.jsx: 로그인 상태 유지/검증
// - api/auth.js: 세션/로그아웃/CSRF 유틸
// ──────────────────────────────────────────────────────────────

import React from "react";

// <백엔드 기본 URL>
// - VITE_API_BASE_URL 환경변수에서 읽고, 없으면 localhost:8080을 기본값으로 사용.
// - 개발/배포 환경에 따라 자동으로 분기 가능.
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

const LoginPage = () => {
  // <Google OAuth2 로그인 시작>
  // - /oauth2/authorization/google 은 Spring Security의 OAuth2 Client 기본 엔드포인트.
  // - 클릭 시 브라우저 전체 리다이렉트(window.location.assign)
  // - Vite dev server 프록시가 '/oauth2' 요청을 백엔드로 전달.
  const handleLogin = () => {
    window.location.assign(`${API_BASE}/oauth2/authorization/google`);
  };

  return (
    // 전체 화면 중앙 정렬
    // - 100dvh: 모바일 브라우저 UI 제외한 실제 뷰포트 높이 단위
    // - 배경: 연한 회색(#f5f5f5)
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
      {/* 서비스 로고 */}
      <img src="src/assets/logo.png" alt="Medi냥 로고" style={{ width: 180 }} />

      {/* 로그인 안내 문구 */}
      <p style={{ fontSize: 14, marginBottom: 40 }}>
        메디냥과 함께 건강한 생활을 시작해보세요!
      </p>

      {/* 구분선 + "소셜 로그인" 텍스트 */}
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

      {/* 구글 로그인 버튼 */}
      {/* - Google 아이콘 + 텍스트 구성
          - 클릭 시 handleLogin() 호출 → 백엔드 OAuth2 인증 시작 */}
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
        {/* Google 로고 이미지 (공식 firebase-ui 이미지 사용) */}
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google 로고"
          width={18}
          height={18}
        />
        Google 계정으로 로그인
      </button>
    </div>
  );
};

export default LoginPage;

/* ──────────────────────────────────────────────────────────────
📘 [요약: 백엔드용 참고]
1. 프론트 → GET /oauth2/authorization/google 리다이렉트  
   → Spring Security OAuth2 Login Filter 동작  
   → 구글 인증 완료 후 redirect_uri 로 돌아오며 JSESSIONID 발급.  
2. 이후 프론트는 AuthContext에서 checkSession()으로 세션 유효성 확인.  
3. fetch 호출은 모두 credentials:'include' 로 쿠키를 동반해야 세션 유지.  
4. 로그아웃은 POST /auth/logout → JSESSIONID 만료 및 쿠키 제거.  
────────────────────────────────────────────────────────────── */
