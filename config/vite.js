const Path = require('path');
const vuePlugin = require('@vitejs/plugin-vue')

const { defineConfig } = require('vite');

var WindiCSS = require('vite-plugin-windicss').default

/**
 * https://vitejs.dev/config
 */
const config = defineConfig({
    root: Path.join(__dirname, '..', 'src', 'renderer'),
    publicDir: 'public',
    server: {
        port: 8080,
    },
    open: false,
    build: {
        outDir: Path.join(__dirname, '..', 'build', 'renderer'),
        emptyOutDir: true,
    },
    plugins: [vuePlugin({
        reactivityTransform: true
      }), WindiCSS({
        config: Path.join(__dirname, '..', 'windi.config.ts'),
        root: Path.dirname(__dirname),
      })],
    resolve: {
        alias: {
            '@': Path.join(__dirname, '..', 'src', 'renderer')
        }
    }
});

module.exports = config;