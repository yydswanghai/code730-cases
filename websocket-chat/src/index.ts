import Koa from 'koa'
import koaStatic from 'koa-static'
import http from 'http'
import { resolve } from 'path'
import chatServer from './chatServer'

const app = new Koa();
const server = http.createServer(app.callback());

app.use(
    koaStatic(resolve(__dirname, './public'), {
        index: 'index.html'
    })
)

chatServer(server)

server.listen(9525, () => console.log('server listening 9525'))