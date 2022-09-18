/**
 * cors解决跨域 原理
 */
const whiteList = [
    'http://127.0.0.1:5500',
    'null'
]

export default function (req, res, next) {
    // 处理预检请求
    if(req.method === 'OPTIONS'){
        res.header('access-control-allow-method', req.headers['access-control-request-method'])
        res.header('access-control-allow-headers', req.headers['access-control-request-headers'])
    }
    // 允许附带身份凭证的请求
    res.header('access-control-allow-credentials', true)
    // 处理简单请求
    if('origin' in req.headers && whiteList.includes(req.headers.origin)){
        res.header('access-control-allow-origin', req.headers.origin)
    }
    next();
}