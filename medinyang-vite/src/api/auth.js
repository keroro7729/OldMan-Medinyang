// src/api/auth.js
// 백엔드: Spring Security OAuth2 리다이렉트 방식 가정
// 모든 호출은 '상대 경로'로 해서 Vite 프록시를 탑니다.

//
// 세션 확인: 로그인되어 있으면 200 + 사용자 정보 반환
//
export async function checkSession() {
  const res = await fetch('/auth/session', {
    method: 'GET',
    credentials: 'include', // 세션 쿠키 포함
    // GET에 Content-Type 헤더를 넣으면 불필요한 preflight 발생 → 넣지 않음
  });
  if (res.status === 401) throw new Error('NO_SESSION');
  if (!res.ok) throw new Error(`SESSION_CHECK_FAILED:${res.status}`);
  return res.json();
}

//
// 로그인 페이지로 리다이렉트 (Spring OAuth2)
// 버튼에서 이 함수를 호출하면 됨
//
export function loginRedirect() {
  // 프록시를 타기 위해 절대 URL 대신 상대 경로 사용
  window.location.href = '/oauth2/authorization/google';
}

//
// CSRF 토큰 (JSON) 획득
//
async function getCsrfToken() {
  const res = await fetch('/api/csrf-token', { credentials: 'include' });
  if (!res.ok) throw new Error(`CSRF_FETCH_FAILED:${res.status}`);
  const data = await res.json(); // { token: "..." }
  if (!data?.token) throw new Error('CSRF_TOKEN_MISSING');
  return data.token;
}

//
// 로그아웃 (백엔드가 /auth/logout 지원 가정)
// 필요 시 CSRF 포함
//
export async function logout() {
  try {
    const token = await getCsrfToken();
    const res = await fetch('/auth/logout', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': token,
      },
      body: '{}',
    });
    if (!res.ok) throw new Error(`LOGOUT_FAILED:${res.status}`);
    return true;
  } catch (e) {
    // 백엔드 설정에 따라 /logout GET 허용 시 폴백
    try {
      await fetch('/logout', { credentials: 'include' });
    } catch (err) {
      console.warn("Logout fallback also failed:", err);
    }
    return false;
  }
}



//
// 라우트 진입 시 로그인 보장 유틸 (선택)
// navigate를 넘기면 자동으로 /login 이동
//
export async function ensureAuth(navigate) {
  try {
    await checkSession();
    return true;
  } catch {
    if (navigate) navigate('/login', { replace: true });
    else window.location.assign('/login');
    return false;
  }
}
