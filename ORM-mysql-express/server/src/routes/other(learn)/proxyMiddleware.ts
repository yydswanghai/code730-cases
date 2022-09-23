import http from 'http'
/**
 * 代理服务器
 * /data/api/movie => http://yuanjin.tech:5100/api/movie
 */
export default function (req, res, next) {
    const context = '/data';
    if(!(req.path as string).startsWith(context)){
        // 不需要代理
        next();
        return;
    }
    // 需要代理
    const proxyPath = req.path.substr(context.length);
    // 创建代理请求对象
    const request = http.request({
        host: 'yuanjin.tech',
        port: 5100,
        path: proxyPath,
        method: req.method,
        headers: req.headers
    }, response => {
        // 代理响应对象
        res.status(response.statusCode);
        Object.keys(response.headers).forEach(key => {
            res.setHeader(key, response.headers[key])
        })
        response.pipe(res)
    })
    req.pipe(request)
}