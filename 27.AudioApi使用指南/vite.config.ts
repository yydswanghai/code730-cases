import vue from '@vitejs/plugin-vue'
import type { ConfigEnv, UserConfig } from 'vite'
import path from 'node:path'

// https://vite.dev/config/
export default ({ mode }: ConfigEnv): UserConfig => {

  return {
    base: './',
    resolve: {
      alias: {
        '@': path.join(__dirname, './src'),
        '~': path.join(__dirname, './src/assets'),
        '~root': path.join(__dirname, '.'),
      },
    },
    plugins: [vue()],
  }
}
