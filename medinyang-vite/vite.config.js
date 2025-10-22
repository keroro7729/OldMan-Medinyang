// vite.config.ts / vite.config.js
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  const API = env.VITE_API_BASE_URL || 'http://localhost:8080'

  return defineConfig({
    plugins: [react()],
    server: {
      host: true, // ⬅️ 여기로 이동
      proxy: {
        '/ws': {
          target: API,
          changeOrigin: true,
          ws: true,
        },
        '/auth': {
          target: API,
          changeOrigin: true,
        },
        '/login': {
          target: API,
          changeOrigin: true,
        },
        // ⬇️ 추가: OAuth 리다이렉트도 같은 오리진으로 태워줌
        '/oauth2': {
          target: API,
          changeOrigin: true,
        },
        // (선택) 로그아웃도 프록시
        '/logout': {
          target: API,
          changeOrigin: true,
        },
        // API는 반드시 상대경로로 호출해야 프록시를 탐
        '/api': {
          target: API,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  })
}
