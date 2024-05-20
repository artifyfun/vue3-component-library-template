import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';

const origin = 'http://localhost:7011/'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const commonConfig = {
    server: {
      proxy: {
        "/comfyui": {
          target: "http://localhost:8188",
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(/^\/comfyui/, ""),
        },
        '/platform-center/api': {
          target: origin,
          changeOrigin: true
        },
        '/app-center/api': {
          target: origin,
          changeOrigin: true
        },
        '/workflows/api': {
          target: origin,
          changeOrigin: true
        },
      },
    },
    plugins: [
      vue(),
      Components({
        resolvers: [
          AntDesignVueResolver({
            importStyle: false, // css in js
          }),
        ],
      }),
    ],
    resolve: {
      alias: {
        '~': resolve(__dirname, 'src', 'lib'),
      },
    },
  }
  if (mode === 'live-demo') {
    return {
      ...commonConfig,
      base: './',
      test: {
        globals: true,
      },
      build: {
        rollupOptions: {
          input: ['index.html'],
        },
      },
    }
  } else {
    return {
      ...commonConfig,
      test: {
        globals: true,
        setupFiles: 'src/setupTests.js',
        includeSource: ['src/**/*.spec.js', 'src/**/*.test.js'],
      },
      build: {
        lib: {
          entry: resolve(__dirname, 'src/lib/index.js'),
          name: 'ArtifyfunVueComponents',
          fileName: 'index',
        },
        rollupOptions: {
          external: ['vue'],
          output: {
            globals: {
              vue: 'Vue',
            },
          },
        },
      },
    }
  }
})
