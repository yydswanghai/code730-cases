import { createApp } from 'vue'
import App from './App.vue'
import { store } from './store'
import { router } from './router'
import '@/styles/index.scss'
import { createRouterGuards } from '@/router/router-guards'// 路由鉴权

const app = createApp(App)

app.use(store)

app.use(router)

createRouterGuards(router)

app.mount('#app')