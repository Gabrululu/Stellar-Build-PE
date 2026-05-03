import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Necesario para compatibilidad de stellar-sdk en el browser
    global: 'globalThis',
  },
});
