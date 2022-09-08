import fs from 'fs'
import path from 'path'
import net from 'net'

const server = net.createServer();

server.listen(9527);

server.on('listening', () => {
    console.log('server listen 9527')
})

server.on('connection', (socket) => {
    console.log('有客户端连接到服务器')

    socket.on('data', async (chunk) => {
        const filename = path.resolve(__dirname, './img.jpeg');
        const bodyBuffer = await fs.promises.readFile(filename);
        // 注意中间不能留空格，否则浏览器解析失败
        const headBuffer = Buffer.from(`HTTP/1.1 200 OK
Content-Type: image/jpeg

`,
        'utf-8')

        const result = Buffer.concat([headBuffer, bodyBuffer])
        socket.write(result);
        socket.end();
    })
})

server.on('end', () => {
    console.log('连接关闭了')
})