import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    headers: {
      'Content-Security-Policy':
        "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' fonts.googleapis.com; img-src 'self' data: https://intextmovieposter.blob.core.windows.net; frame-ancestors 'none'; font-src 'self' fonts.gstatic.com data: assets.nflxext.com; connect-src 'self' https://black-flower-0d9471f1e.6.azurestaticapps.net/; object-src 'none'; base-uri 'self'; form-action 'self';",
    },
  },
});
