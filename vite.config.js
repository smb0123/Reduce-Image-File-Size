import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' 로 두면 하위 경로(GitHub Pages 등)에 배포해도 동작합니다.
export default defineConfig({ base: '/Reduce-Image-File-Size/', plugins: [react()] });
