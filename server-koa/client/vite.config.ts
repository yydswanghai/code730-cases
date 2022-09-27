import { loadEnv } from 'vite'
import type { UserConfig, ConfigEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'path'

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir);
}

export default ({ command, mode }:ConfigEnv):UserConfig => {
  const env = loadEnv(mode, process.cwd());
  console.log(env, process.env.NODE_ENV);// todo

  return {
    base: env.VITE_BASE_PATH,
    resolve: {
      alias: [
        {
          find: '@',
          replacement: `${pathResolve('src')}/`
        }
      ],
    },
    server: {
      host: true,
      port: Number(env.VITE_PORT),
      open: true,
      strictPort: false,
      proxy: {
        '/api': {
          target: env.VITE_API_URL,
          changeOrigin: true,
          // rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    plugins: [
      vue(),
      vueJsx(),
    ]
  }
}
