import Koa from 'koa'
import http from 'http'
import { resolve } from 'path'
import koaStatic from 'koa-static'
import { historyApiFallback } from 'koa2-connect-history-api-fallback'
import koaBody from 'koa-body'
import session from 'koa-session'
import tokenMid from './middleware/token4jwt'
import corsMid from './middleware/cors'
import proxyMid from './middleware/proxy'
import apiLogMid from './middleware/apiLog'
import adminRouter from './api/admin'

const app = new Koa();
const server = http.createServer(app.callback());

app.keys = ['i secret for wanghai']
const CONFIG = {
    key: 'koa.sessid',
    maxAge: 86400 * 1000,
    overwrite: true,
    httpOnly: true,
    signed: false,
    rolling: false,
    renew: false
}
app.use(session(CONFIG, app))
app.use(corsMid)
app.use(koaBody())// 处理请求
app.use(proxyMid)
app.use(apiLogMid)
app.use(tokenMid)
app.use(historyApiFallback({
    whiteList: ['/api']
}))
app.use(koaStatic(resolve(__dirname, '../../public/')))

app.use(adminRouter)

app.on('error', err => {
    console.error(err);
})

server.listen(9525, () => console.log('server listening 9525'))