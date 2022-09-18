import http from './request'

function delay(duratioin: number = 2000) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(null);
        }, duratioin);
    });
}

/* 登录 */
export async function login({ loginId = '', loginPwd = '' }) {
    await delay(500)
    return await http().request({
        method: 'post',
        url: '/api/admin/login',
        data: {
            loginId,
            loginPwd
        }
    })
}
/* 注销 */
export async function loginOut() {
    localStorage.removeItem("token");
}

export async function whoAmI() {
    await delay();
    return await http().request({
        method: 'get',
        url: '/api/admin/whoami'
    })
}
