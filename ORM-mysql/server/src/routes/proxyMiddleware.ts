import { createProxyMiddleware } from 'http-proxy-middleware'

// /data/api/movie => http://yuanjin.tech:5100/api/movie

const context = '/data'
const proxy = createProxyMiddleware(context, {
    target: 'http://yuanjin.tech:5100',
    pathRewrite(path, req){
        return path.substring(context.length)
    },
})

export default proxy