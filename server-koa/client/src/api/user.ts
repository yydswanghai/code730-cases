import { http } from './http'
import { userEnum } from '@/enums/userEnum'

/* 登录 */
export function login(data: { loginId: string, loginPwd: string }, type: userEnum) {
    let params = {};
    if(type === userEnum.user1){// 个人用户
        params = { scope: 'app', type: '1' }
    }else if(type === userEnum.user2){// 组织用户
        params = { scope: 'app', type: '2' }
    }else if(type === userEnum.system){// 后台用户
        params = { scope: 'server' }
    }
    return http.request({
        method: 'post',
        url: '/admin/oauth/token',
        params,
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