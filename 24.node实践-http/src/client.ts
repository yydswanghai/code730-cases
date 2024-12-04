import http from 'http'

const request = http.request('http://yuanjin.tech:5005/api/movie', {
    method: 'GET'
}, resp => {
    console.log('服务器响应状态码：',resp.statusCode)
    console.log('服务器响应头：',resp.headers)

    let result = '';
    resp.on('data', (chunk: Buffer) => {
        result += chunk.toString('utf-8');
    })
    resp.on('end', () => {
        console.log(JSON.parse(result))
    })
})

// 发送POST就是向消息体里写东西
// request.write(`a=1&b=2`)

// 表示消息体结束，如果不写end会认为你一直在连接中
request.end();