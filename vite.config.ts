import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteTsconfigPaths(),
  ],
  build: {
    outDir: 'build',

   /* rollupOptions: {
      plugins: [
        // Enable rollup polyfills plugin
        // used during production bundling
        rollupNodePolyFill()
      ]
    }*/
  },
  server: {
    open: false,
    port: 4210,
    hmr: true
  },
  resolve: {
    alias: [
      // { find: '@', replacement: path.resolve(__dirname, 'src') },
      // fix less import by: @import ~
      // https://github.com/vitejs/vite/issues/2185#issuecomment-784637827
      {find: /^~/, replacement: ''},

      {find: "process", replacement: 'process/browser'},
      {find: "stream", replacement: 'stream-browserify'},
      {find: "zlib", replacement: 'browserify-zlib'},
      {find: "util", replacement: 'util'},

      {find: "buffer", replacement: 'rollup-plugin-node-polyfills/polyfills/buffer-es6'},
    ]
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis'
      },
      // Enable esbuild polyfill plugins
      /*plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true
        }),
        NodeModulesPolyfillPlugin()
      ]*/
    }
  },
})
