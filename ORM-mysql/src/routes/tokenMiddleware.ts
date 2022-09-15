import { getError } from './getSendResult'
import { pathToRegexp } from 'path-to-regexp'
import { decrypt } from '../utils/crypt'

const needTokenApi = [
    { method: 'POST', path: '/api/student' },
    { method: 'PUT', path: '/api/student/:id' },
    { method: 'GET', path: '/api/student' }
]
/**
 * 用于解析token
 */
export default function (req, res, next) {
    // 判断api是否需要token，请求方式和请求请求路径都匹配
    const apis = needTokenApi.filter((api) => {
        const reg = pathToRegexp(api.path);// 返回一个正则
        return api.method === req.method && reg.test(req.path)
    })
    // 该api不在需要鉴权的api列表里
    if(apis.length === 0){
        next();
        return;
    }

    // 剩下就是需要鉴权的api的逻辑
    let token = req.cookies.token;
    if(!token){
        // 从 header 的 authorization 中获取
        token = req.headers.authorization;
    }
    if(!token){
        // 没有认证
        handleNonToken(req, res, next);
        return;
    }
    // 认证通过
    const userId = decrypt(token);// 解密token
    req.userId = userId;// 添加到请求
    next();
}
// 认证不通过
function handleNonToken(req, res, next) {
    res.status(403).send(getError('你还没有认证身份', 403));
}
