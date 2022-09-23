import { getError } from '../getSendResult'
import { pathToRegexp } from 'path-to-regexp'

const needTokenApi = [
    { method: 'POST', path: '/api/student' },
    { method: 'PUT', path: '/api/student/:id' },
    { method: 'GET', path: '/api/student' }
]
/**
 * 用于解析token - 使用session验证
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

    if(req.session.loginUser){
        // 说明已经登录过
        next()
    }else{
        handleNonToken(req, res, next)
        return;
    }
}
// 认证不通过
function handleNonToken(req, res, next) {
    res.status(403).send(getError('你还没有认证身份', 403));
}
