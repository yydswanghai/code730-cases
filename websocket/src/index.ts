import { createServer } from 'net'
import { createHash } from 'crypto'

const server = createServer(socket => {
    console.log('收到客户端的连接')
    socket.once('data', (chunk) => {
        const response = chunk.toString('utf-8');
        const { header: headers } = parseResponse(response);

        const hash = createHash('sha1');
        hash.update(
            headers["Sec-WebSocket-Key"] + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"
        );
        const key = hash.digest("base64");
        // websocket协议在建立连接后服务器响应 状态码101，表示切换协议(Switching Protocols)
        // Connection: Upgrade 表示升级协议
        // Upgrade: websocket 升级的协议为websocket
        // Sec-WebSocket-key: '...' 客户端发送给服务端的key，服务端要通过这个key生成一个key返还给客户端，表示双方可以进行通信
        socket.write(`HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: ${key}

`)
        // websocket服务端收到的消息格式：二进制位的数据
        // 因为websocket对消息数量没有任何限制，如果你发送比较大的数据，可能需要切片，切为一帧一帧的数据的格式来发送
        // 而服务器收到数据的顺序是不确定的，可能第一帧的数据跑第三次发送了
        // 所以数据里需要告诉服务器，这一帧数据的为第几帧，一共有多少数据
        socket.on('data', (chunk) => {
            console.log(chunk)
        })
    })
})

function parseResponse(response: string) {
    const index = response.indexOf('\r\n\r\n');
    const head = response.substring(0, index);
    const body = response.substring(index + 2);
    const headParts = head.split('\r\n');
    const headArray = headParts.slice(1).map(str => {
        return str.split(':').map(s => s.trim())
    })
    const header = headArray.reduce((prev, cur) => {
        prev[cur[0]] = cur[1]
        return prev;
    }, {})
    return {
        header,
        body: body.trimStart()
    }
}

server.listen(9525)