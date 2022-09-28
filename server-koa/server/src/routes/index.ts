import Koa from 'koa'
import http from 'http'
import { resolve } from 'path'
import koaFallback from './koa-fallback'
import koaStatic from './koa-static'

const app = new Koa();
const server = http.createServer(app.callback());

app.use(koaFallback)
app.use(koaStatic(resolve(__dirname, '../../public/')))

server.listen(9525, () => console.log('server listening 9525'))