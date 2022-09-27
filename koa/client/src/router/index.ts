import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/store/modules/user'


const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: () => import('@/views/home.vue')
    },
    {
        path: "/protect",
        component: () => import("@/views/protect.vue"),
        beforeEnter(to, from, next) {
            const userStore = useUserStore()
            if (userStore.data) {
                //有用户
                next();
            } else {
                next("/login");
            }
        },
    },
    {
        path: "/login",
        component: () => import("@/views/login.vue"),
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    strict: true,
    scrollBehavior: () => ({ left: 0, top: 0 }),
})

export { router }