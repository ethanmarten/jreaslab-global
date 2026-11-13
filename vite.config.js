import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig(({isSsrBuild})=>({plugins:[react()],build:{rollupOptions:{output:{manualChunks:isSsrBuild?undefined:{motion:['motion/react'],i18n:['i18next','react-i18next']}}}}}));
