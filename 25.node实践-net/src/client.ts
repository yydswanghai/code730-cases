import net from 'net'

const socket = net.createConnection({
    host: 'blog.yuanjin.tech',
    port: 80
}, () => {
    console.log('连接成功')
})
// 提炼出响应字符串的消息头和消息体
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
// 时候结束
function isOver() {
    //需要接收的消息体的总字节数
    const contentLength = +receive.header["Content-Length"];
    const curReceivedLength = Buffer.from(receive.body, "utf-8").byteLength;
    console.log(contentLength, curReceivedLength);
    return curReceivedLength > contentLength;
}

let receive: any = null;
socket.on('data', chunk => {
    const response = chunk.toString('utf-8')
    if(!receive){
        // 第一次
        receive = parseResponse(response)
        if (isOver()) {
            socket.end();
        }
        // todo 第一次的chunk字节数就已经传完了，还未处理退出
        return;
    }
    receive.body += response;
    if (isOver()) {
        socket.end();
        return;
    }
})

// 请求行
// 请求头
// 请求体 两个换行表示：从请求头到请求体的间隔
socket.write(`GET / HTTP/1.1
Host: blog.yuanjin.tech
Connection: keep-alive

`);

socket.on('close', () => {
    console.log('结束了！')
})