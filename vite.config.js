import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig(({ mode }) => ({
  base: '/SealTheOcean/',
  root: '.',
  publicDir: false,

  define: {
    __DEV__: mode === 'development',
  },

  build: {
    target: 'es2020',
    outDir: 'dist',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.debug'],
      },
      format: {
        comments: false,
      },
    },
    assetsInlineLimit: Infinity,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },

  plugins: [viteSingleFile()],

  server: {
    open: true,
    port: 3000,
  },
}));
