import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: "/Rizal3rd",
  build: {
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/\.(glb|gltf)$/.test(assetInfo.name)) {
            return `models/[name][extname]`;
          }
          if (/\.(png|jpe?g|webp|gif|svg)$/.test(assetInfo.name)) {
            return `characters/[name][extname]`;
          }
          return `assets/[name].[hash][extname]`;
        }
      }
    }
  }
});