import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default ({ mode }) => {
  
  const env = loadEnv(mode, process.cwd());

  return defineConfig({
    host: true,
    plugins: [react()],
    server: {
      proxy: {
        '/ws': {
          target: env.VITE_API_BASE_URL, // ✅ 문자열로 가져옴
          changeOrigin: true,
          ws: true,
        },
        '/auth': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
        },
        '/login': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
        },
      },
    },
  });
};
