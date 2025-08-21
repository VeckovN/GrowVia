import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tscongPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
  root: '.',
  plugins: [
    react({
      //Our compontents are with .tsx, 
      //and every time we have changes, we want to have automatical reload
      include: '**/*.tsx'
    }),
    //and every time we have changes, we want to have automatical reload
    tscongPaths(),
    svgr({
      svgrOptions: {
        icon: true, // optional, makes svg size behave like an icon
      },
    }),
  ],
  resolve: {
    alias: {
      src: '/src'
    }
  },
  build: {
    outDir: './build'
  },
  //defaul is :5173 but we can change it to our "CLIENT_URL" which is :3000
  server: {
    port: 3000
  }
});
