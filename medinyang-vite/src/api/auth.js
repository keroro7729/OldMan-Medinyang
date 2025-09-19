export async function checkSession() {
  return fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/session`, {
    method: "GET",
    headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "69420", // ✅ 이 줄 추가
  },
    credentials: "include", // ✅ 쿠키 포함해서 세션 체크
    mode:"cors",
  }).then((res) => {
    if (!res.ok) throw new Error("세션 없음");
    return res.json();
  });

  
}
export async function logout() {
  return fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/logout`, {
    method: "POST",
    credentials: "include", // ✅ 세션 쿠키 포함
  });
}
