import { http } from './http'

/* 登录 - 个人用户 */
export function loginByU1(data: { loginId: string, loginPwd: string }) {
    return http.request({
        method: 'post',
        url: '/admin/oauth/token',
        params: { scope: 'app', type: '1' },
        data,
    })
}
/* 登录 - 组织用户 */
export function loginByU2(data: { loginId: string, loginPwd: string }) {
    return http.request({
        method: 'post',
        url: '/admin/oauth/token',
        params: { scope: 'app', type: '2' },
        data,
    })
}
/* 登录 - 后台用户 */
export function loginBySystem(data: { loginId: string, loginPwd: string }) {
    return http.request({
        method: 'post',
        url: '/admin/oauth/token',
        params: { scope: 'server' },
        data,
    })
}
/* 获取用户信息 */
export function getUserInfo(params: { type: string }) {
    return http.request({
        method: 'get',
        url: '/admin/loginInfo',
        params,
    })
}
/* 获取用户菜单 */
export function getUserMenu() {
    return http.request({
        method: 'get',
        url: '/admin/menus',
    })
}
/* 登出 */
export function logout() {
    return http.request({
        method: 'delete',
        url: '/admin/logout',
    })
}