import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from "node:path";
import dts from 'vite-plugin-dts'
import tsConfigPaths from 'vite-tsconfig-paths'
import * as packageJson from './package.json'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tsConfigPaths(),
        dts({
            include: ['src/components/'],
        }),
    ],
    build: {
        lib: {
            entry: resolve('src', 'components/index.ts'),
            name: 'ThemelioCore',
            formats: ['es', 'umd'],
            fileName: (format) => `react-tanstack-editable-table.${format}.js`,
        },
        rollupOptions: {
            external: [...Object.keys(packageJson.peerDependencies)],
        },
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
