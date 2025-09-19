import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuth(); // 전역 로그인 상태 업데이트 함수

  // ✅ Google 로그인 성공 시 호출되는 함수
  const handleLoginSuccess = (credentialResponse) => {
    const idToken = credentialResponse.credential; // Google에서 받은 ID Token

    // ✅ 백엔드로 ID 토큰 전송 → 서버 측 세션 생성 요청
    fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/google`, {
      method: "POST",
      credentials: "include", // 쿠키 포함
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "69420",
      },
      body: JSON.stringify({ idToken }),
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("백엔드 인증 실패");
        }

        const data = await res.json();

        // ✅ 세션 ID 및 인증 토큰 로컬 스토리지에 저장
        localStorage.setItem("jsessionId", data.data.jsessionId);
        localStorage.setItem("accessToken", data.token || "");
        localStorage.setItem("isLoggedIn", "true");

        // ✅ 유저 목록 불러오기 (가족 구성원 등)
        const userRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users`, {
          method: "GET",
          credentials: "include",
          headers: {
            "ngrok-skip-browser-warning": "69420",
          },
        });

        if (!userRes.ok) throw new Error("유저 목록 조회 실패");
        const userList = await userRes.json();

        // ✅ 유저가 없다면 추가 페이지로 이동
        if (userList.length === 0) {
          navigate("/add-user");
        } else {
          // ✅ 유저가 있다면 첫 번째 유저 선택 후 메인 페이지 이동
          localStorage.setItem("users", JSON.stringify(userList));
          localStorage.setItem("currentUser", JSON.stringify(userList[0]));
          navigate("/main");
        }

        setIsLoggedIn(true); // 전역 로그인 상태 true로 전환
      })
      .catch((err) => {
        console.error("서버 인증 실패", err);
        alert("로그인에 실패했어요 😢");
      });
  };

  // ✅ Google 로그인 실패 시
  const handleLoginError = () => {
    console.error("Google 로그인 실패");
    alert("구글 로그인에 실패했어요");
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
      {/* 메디냥 로고 */}
      <img
        src="src/assets/logo.png"
        alt="Medi냥 로고"
        style={{ width: 180 }}
      />

      {/* 안내 문구 */}
      <p style={{ fontSize: "14px", marginBottom: 40 }}>
        메디냥과 함께 건강한 생활을 시작해보세요!
      </p>

      {/* 소셜 로그인 안내 구분선 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          margin: "24px 0",
          width: "100%",
          maxWidth: "300px",
        }}
      >
        <div style={{ flex: 1, height: "1px", backgroundColor: "#ccc" }} />
        <span style={{ fontSize: "14px", color: "#555", whiteSpace: "nowrap" }}>
          소셜 로그인
        </span>
        <div style={{ flex: 1, height: "1px", backgroundColor: "#ccc" }} />
      </div>

      {/* Google OAuth 로그인 버튼 */}
      <div style={{ marginBottom: "150px" }}>
        <GoogleLogin
          onSuccess={handleLoginSuccess} // 성공 시 처리 함수
          onError={handleLoginError}     // 실패 시 처리 함수
        />
      </div>
    </div>
  );
};

export default LoginPage;
