import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 3000,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Resource-Policy': 'cross-origin'
    }
  },
  plugins: [react()],
  define: { 
    global: 'globalThis',
    'process.env': {}
  },
  optimizeDeps: {
    include: ['@zama-fhe/relayer-sdk/bundle'],
    exclude: ['@zama-fhe/relayer-sdk']
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      external: []
    }
  }
});
