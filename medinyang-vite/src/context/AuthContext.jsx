// ✅ AuthContext.jsx: 로그인 세션 상태를 전역에서 관리하는 React Context
// - 목적: 앱 어디서든 `isLoggedIn`(로그인 여부)와 `loading`(세션 확인 중)을 일관되게 참조
// - 전제: 백엔드가 Spring Security + OAuth2 세션을 사용하며
//         `GET /auth/session`(또는 유사 엔드포인트) 호출 시
//         200이면 유효 세션, 401/403이면 무효 세션을 반환한다는 계약을 따름.
// - 중요: checkSession() 구현은 fetch에 `credentials: 'include'`가 설정되어 있어야 함
//         (세션 쿠키 전송을 위해). 이 파일에서는 해당 함수가 그 전제를 만족한다고 가정.

import { createContext, useContext, useState, useEffect } from "react";
import { checkSession } from "../api/auth"; // 세션 유효성 확인 API (200→OK, 401/403→무효)

// ✅ 컨텍스트 생성
// - React Context는 트리 하위 어디서든 전역 상태를 구독할 수 있게 해준다.
// - 기본값은 undefined; Provider가 감싸지 않은 곳에서 useAuth()를 쓰면 런타임 에러를 유도하기 위해 별도 기본값을 넣지 않음.
const AuthContext = createContext();

/**
 * ✅ AuthProvider
 * - 앱 루트(예: <App />)를 감싸 전역 로그인 상태를 제공한다.
 * - 마운트 시점에 백엔드로 세션 확인(= 신뢰 가능한 소스 권위) 요청을 1회 수행한다.
 *
 * 상태 설명
 * - isLoggedIn: boolean
 *    - true  : 백엔드가 유효한 세션(200)을 응답
 *    - false : 세션 없음/만료(401/403 등), 혹은 네트워크 오류로 판별 불가 시 보수적으로 false
 * - loading: boolean
 *    - true  : 세션 확인 중(스피너/플레이스홀더 렌더링에 사용)
 *    - false : 확인 완료(성공/실패 불문)
 *
 * 왜 loading이 필요한가?
 * - 세션 확인 전까지는 로그인 여부를 단정할 수 없음.
 * - 보호 라우트에서 깜박임(잠깐 렌더 후 다시 로그인 페이지로 튕김)을 방지하려면
 *   세션 확인이 끝날 때까지 실제 화면 대신 로딩 상태를 보여주는 것이 UX에 유리.
 */
export function AuthProvider({ children }) {
  // 로그인 여부. 기본 false로 두고, 서버 결과로 확정한다.
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 세션 확인 중 여부. 최초 마운트에서만 true → checkSession() 완료 시 false.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false; // 비동기 완료 전에 언마운트될 수 있으므로 안전 가드

    // 1) 백엔드에 세션 확인 요청
    //   - 백엔드 계약:
    //     * 200 OK  → 유효 세션
    //     * 401/403 → 비로그인/만료
    //     * 5xx     → 서버 오류(네트워크 실패 포함) → 보수적으로 false 처리
    checkSession()
      .then(() => {
        if (cancelled) return;
        setIsLoggedIn(true);
      })
      .catch(() => {
        if (cancelled) return;
        // 주의: 네트워크/서버 오류까지 로그인 실패로 본다.
        // UX 상 “재시도” 버튼을 두고 싶다면 별도 오류 상태를 분리해도 됨.
        setIsLoggedIn(false);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    // 2) 클린업: 컴포넌트가 언마운트되면 이후 setState 호출 방지
    return () => {
      cancelled = true;
    };
  }, []);

  // Provider로 하위 트리에 상태를 공급한다.
  // - setIsLoggedIn 공개 이유: 로그인/로그아웃 직후 즉시 UI 반영이 필요할 수 있음
  //   (예: 명시적 logout() 성공 시 isLoggedIn=false로 즉시 갱신)
  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * ✅ useAuth 훅
 * - 어디서든 `const { isLoggedIn, loading, setIsLoggedIn } = useAuth();` 형태로 접근.
 * - 가드/네비게이션에서 주로 사용:
 *    if (loading) return <Spinner/>
 *    if (!isLoggedIn) return <Navigate to="/login" replace />
 *    return <ProtectedPage/>
 *
 * 사용 시 주의
 * - Provider 외부에서 호출하면 컨텍스트가 undefined → 런타임 오류.
 *   반드시 <AuthProvider>로 앱을 감싸고 사용.
 */
export function useAuth() {
  return useContext(AuthContext);
}

/* ──────────────────────────────────────────────────────────────────────────
   참고: 백엔드 분들을 위한 흐름 요약 (AuthContext 관점)
   1) 프런트 부팅 → AuthProvider 마운트 → checkSession() 1회 호출
      - checkSession()는 SAME-ORIGIN 요청이며, fetch 옵션에
        credentials: 'include'가 설정되어 있어 세션 쿠키가 함께 전송됨.
      - 서버는 세션이 유효하면 200, 아니면 401/403을 반환.
   2) 응답에 따라 isLoggedIn true/false 확정 → loading=false
   3) 보호 라우트는 loading이 false가 된 이후 isLoggedIn을 판별해
      접근 허용 또는 로그인 페이지로 리다이렉트.
   4) 로그아웃 시나리오
      - 클라이언트에서 /auth/logout 호출 성공 → setIsLoggedIn(false)
      - 서버에서 세션 무효화 처리(쿠키 삭제/세션 만료)
   5) CSRF
      - 세션 보안 정책상 POST/PUT/DELETE 등 state-changing 요청은
        사전에 CSRF 토큰 발급 후 헤더(X-XSRF-TOKEN)로 동봉하도록
        별도 유틸(getCsrfToken)에서 처리. 이 컨텍스트는 “세션 유효성”만 책임.
   ────────────────────────────────────────────────────────────────────────── */

/* ──────────────────────────────────────────────────────────────────────────
   (선택) 고도화 아이디어 - 필요 시 주석 해제하여 적용
   - 포커스 복귀/네트워크 회복 시 세션을 재검증하여 스테일 상태를 줄인다.

   useEffect(() => {
     const revalidate = () => {
       checkSession()
         .then(() => setIsLoggedIn(true))
         .catch(() => setIsLoggedIn(false));
     };
     window.addEventListener('focus', revalidate);
     window.addEventListener('online', revalidate);
     return () => {
       window.removeEventListener('focus', revalidate);
       window.removeEventListener('online', revalidate);
     };
   }, []);
   ────────────────────────────────────────────────────────────────────────── */
