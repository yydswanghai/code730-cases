import Koa from 'koa'
import http from 'http'

const app = new Koa();
const server = http.createServer(app.callback());

app.use(function (ctx, next) {
    console.log(ctx)
})

server.listen(9525, () => console.log('server listening 9525'))