import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Cast process to any to avoid "Property 'cwd' does not exist on type 'Process'" error
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    // This allows process.env.API_KEY to work in the browser code
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});