// ✅ AuthContext.jsx: 로그인 상태를 전역에서 관리하는 컨텍스트

import { createContext, useContext, useState, useEffect } from "react";
import { checkSession } from "../api/auth"; // 세션 유효성 확인 API 호출

// 컨텍스트 생성
const AuthContext = createContext();

// ✅ AuthProvider: 로그인 상태와 로딩 상태를 하위 컴포넌트에 제공
export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 여부
  const [loading, setLoading] = useState(true); // 세션 확인 중 로딩 상태

  // 컴포넌트 마운트 시 세션 확인
  useEffect(() => {
    checkSession()
      .then(() => setIsLoggedIn(true)) // 세션 유효하면 로그인 상태로 설정
      .catch(() => setIsLoggedIn(false)) // 세션 없거나 만료 시 로그아웃 처리
      .finally(() => setLoading(false)); // 로딩 종료
  }, []);

  return (
    // 로그인 상태, 로그인 상태 설정 함수, 로딩 상태를 하위 컴포넌트에 전달
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// ✅ useAuth 훅: 컨텍스트를 쉽게 사용할 수 있도록 하는 커스텀 훅
export function useAuth() {
  return useContext(AuthContext);
}
