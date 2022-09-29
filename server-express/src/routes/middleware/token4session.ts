import { getError } from '../getSendResult'
import { pathToRegexp } from 'path-to-regexp'
import { decrypt } from '../../utils/crypt'

const needTokenApi = [// 需要鉴权的api
    { method: 'POST', path: '/api/student' },
    { method: 'PUT', path: '/api/student/:id' },
    { method: 'GET', path: '/api/student' },
    { method: 'GET', path: '/api/admin/whoami' }
]

/**
 * 前提需要设置session中间件
 * app.use(session({ secret: 'key cat', name: 'sessionid' }));
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

    const token = req.session.userId;
    if(!token){// 没有认证
        res.status(403).send(getError('你还没有认证身份', 403))
        return;
    }else{
        const userId = decrypt(token);
        req.userId = userId;// 添加到请求
        next()
    }
}