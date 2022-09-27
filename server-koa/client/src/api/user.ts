import { http } from './http'
import { delay } from '@/utils/'

/**
 * 登录
 */
export async function login({ loginId, loginPwd }: { loginId: string, loginPwd: string }) {
    await delay()
    return await http.request({
        method: 'post',
        url: '/api/admin/login',
        data: {
            loginId,
            loginPwd
        }
    })
}

export async function whoAmI() {
    return await http.request({
        method: 'get',
        url: '/api/admin/whoami'
    })
}
