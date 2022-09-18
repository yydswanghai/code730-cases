import { getError } from './getSendResult'
import { pathToRegexp } from 'path-to-regexp'
import { jwtVerify } from './jwt'

const needTokenApi = [
    { method: 'POST', path: '/api/student' },
    { method: 'PUT', path: '/api/student/:id' },
    // { method: 'GET', path: '/api/student' },
    { method: 'GET', path: '/api/admin/whoami' }
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

    const result = jwtVerify(req)

    if(result){
        // 认证通过
        req.userId = result.id;
        next();
    }else{
        // 认证失败
        handleNonToken(req, res, next);
    }
}
// 认证不通过
function handleNonToken(req, res, next) {
    res.status(403).send(getError('你还没有认证身份', 403));
}
