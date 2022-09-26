import Koa from 'koa'
import koaStatic from 'koa-static'
import http from 'http'
import { Server } from 'socket.io'
import { resolve } from 'path'

const app = new Koa();
const server = http.createServer(app.callback());
const io = new Server();

io.attach(server);

app.use(
    koaStatic(resolve(__dirname, './public'), {
        index: 'index.html'
    })
)

io.on('connection', (socket) => {
    // 当有一个新的客户端连接到服务器成功之后，触发的事件
    console.log('新的客户端连接进来了')
    socket.on('msg', (chunk: Buffer) => {
        // 监听客户端的msg消息
        console.log(chunk.toString('utf-8'))
    })
    const timer = setInterval(() => {
        // 每隔两秒钟，发送一个消息给客户端，消息为test
        socket.emit('test', '每2秒向客户端推送一次消息')
    }, 2000)

    socket.on('disconnect', () => {
        clearInterval(timer);
        console.log('closed')
    })
})

server.listen(9525, () => console.log('server listening 9525'))