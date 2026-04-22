import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(), 
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['Sortify.png'],
        manifest: {
            name: 'Sortify - Sorting Visualizer',
            short_name: 'Sortify',
            description: 'Aplikasi visualisasi algoritma pengurutan (Bubble Sort & Selection Sort)',
            theme_color: '#ffffff',
            background_color: '#ffffff',
            display: 'standalone',
            icons: [
              {
                src: '/Sortify.png',
                sizes: '192x192',
                type: 'image/png'
              },
              {
                src: '/Sortify1.png', 
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any'
              }
            ],
            screenshots:[
              {
                src: "/screenshots/desktop.png",
                sizes: "1280x720",
                type: "image/png",
                form_factor: "wide"
              },
              {
                src: "/screenshots/mobile.png",
                sizes: "390x844",
                type: "image/png"
              }
            ]
        },
        devOptions: {
          enabled: true
        }
      })
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      host: '0.0.0.0',
      port: 5173,
      allowedHosts: true
    },
  };
});
