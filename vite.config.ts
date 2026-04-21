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
        registerType: 'autoUpdate', // Otomatis update service worker saat ada versi baru
        includeAssets: ['Sortify.png'], // Daftarkan aset statis dari folder public
        manifest: {
            name: 'Sortify - Sorting Visualizer',
            short_name: 'Sortify',
            description: 'Aplikasi visualisasi algoritma pengurutan (Bubble Sort & Selection Sort)',
            theme_color: '#ffffff', // Sesuaikan dengan warna dominan UI Anda
            background_color: '#ffffff',
            display: 'standalone', // Membuatnya tampil seperti native app tanpa address bar browser
            icons: [
              {
                src: '/Sortify.png', // Gunakan file Sortify.png yang sudah ada di folder public
                sizes: '192x192',
                type: 'image/png'
              },
              {
                src: '/Sortify1.png', 
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any' // Disarankan untuk Android
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
          enabled: true // Aktifkan agar bisa di-test saat mode 'npm run dev'
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
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      host: '0.0.0.0',
      port: 5173,
      allowedHosts: true
    },
  };
});
