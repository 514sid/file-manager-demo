import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { copyFileSync } from 'fs'

const REPO_BASE = '/file-manager-demo/'

export default defineConfig(({ command }) => ({
    base: command === 'build' ? REPO_BASE : '/',
    plugins: [
        react(),
        {
            name: 'spa-404-fallback',
            closeBundle() {
                try {
                    copyFileSync('dist/index.html', 'dist/404.html')
                } catch {
                    void 0
                }
            },
        },
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@modules': path.resolve(__dirname, './src/modules'),
            '@config': path.resolve(__dirname, './src/config'),
            '@shared': path.resolve(__dirname, './src/shared'),
            '@stores': path.resolve(__dirname, './src/stores'),
        },
    },
    server: {
        port: 5173,
        host: true,
    },
}))
