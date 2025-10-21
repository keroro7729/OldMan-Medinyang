// 📁 src/api/auth.js
// ----------------------------------------------------
// ✅ 목적: 클라이언트에서 인증 관련 요청을 담당하는 유틸 모듈
// - Spring Security OAuth2 리다이렉트 방식을 가정함
// - 모든 API는 Vite 프록시(/auth/*)를 통해 백엔드로 전달
// - 쿠키 기반 세션 인증이므로 credentials: 'include' 필수
// ----------------------------------------------------


//
// 🧩 1. 세션 확인
//  - 현재 로그인 세션이 유효한지 백엔드에 확인
//  - 정상 시: 200 OK + 사용자 정보(JSON)
//  - 실패 시: 401 → 세션 만료로 간주
//
export async function checkSession() {
  const res = await fetch('/auth/session', {
    method: 'GET',
    credentials: 'include', // ✅ 세션 쿠키(JSESSIONID) 포함
    // ⚠️ GET 요청에 Content-Type을 넣으면 preflight(OPTIONS) 발생 → 생략
  });

  if (res.status === 401) throw new Error('NO_SESSION'); // 미로그인 상태
  if (!res.ok) throw new Error(`SESSION_CHECK_FAILED:${res.status}`); // 기타 오류
  return res.json(); // { userId, email, ... } 형태로 응답
}


//
// 🧩 2. 로그인 리다이렉트
//  - 프론트에서 직접 구글 로그인 엔드포인트로 이동시킴
//  - Spring Security의 /oauth2/authorization/google 엔드포인트 호출
//  - 백엔드 리다이렉트 후 로그인 성공 시 세션이 자동 생성됨
//
export function loginRedirect() {
  window.location.href = '/oauth2/authorization/google'; // ✅ 프록시 경유 (절대 URL 사용 금지)
}


//
// 🧩 3. CSRF 토큰 요청
//  - /api/csrf-token 엔드포인트에서 JSON 형태로 CSRF 토큰을 받아옴
//  - 이후 POST 요청 시 헤더에 X-XSRF-TOKEN으로 첨부 필요
//
async function getCsrfToken() {
  const res = await fetch('/api/csrf-token', { credentials: 'include' });
  if (!res.ok) throw new Error(`CSRF_FETCH_FAILED:${res.status}`);

  const data = await res.json(); // 예: { token: "abcd1234" }
  if (!data?.token) throw new Error('CSRF_TOKEN_MISSING');
  return data.token;
}


//
// 🧩 4. 로그아웃
//  - 백엔드가 /auth/logout (POST) 엔드포인트를 제공한다고 가정
//  - CSRF 토큰을 먼저 발급받은 뒤 요청 본문을 빈 객체로 전송
//  - 실패 시 /logout (GET) 방식으로 폴백 처리
//
export async function logout() {
  try {
    const token = await getCsrfToken(); // ✅ CSRF 토큰 획득
    const res = await fetch('/auth/logout', {
      method: 'POST',
      credentials: 'include', // 세션 쿠키 포함
      headers: {
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': token, // ✅ CSRF 헤더
      },
      body: '{}', // body 필수 (Spring Security 기본 정책)
    });
    if (!res.ok) throw new Error(`LOGOUT_FAILED:${res.status}`);
    return true;
  } catch (e) {
    // ⚠️ 서버 설정에 따라 GET /logout 허용 시 폴백
    try {
      await fetch('/logout', { credentials: 'include' });
    } catch (err) {
      console.warn("Logout fallback also failed:", err);
    }
    return false;
  }
}


//
// 🧩 5. 인증 보장 유틸
//  - 라우트 진입 시 세션 검증
//  - 세션이 없으면 자동으로 /login 으로 리다이렉트
//  - React Router의 navigate 함수를 인자로 받아 활용 가능
//
export async function ensureAuth(navigate) {
  try {
    await checkSession();
    return true; // ✅ 세션 유효
  } catch {
    // ❌ 세션 없음 → 로그인 페이지로 이동
    if (navigate) navigate('/login', { replace: true });
    else window.location.assign('/login');
    return false;
  }
}
