import http from 'http'
import url from 'url'

const server = http.createServer((req, res) => {
    console.log('有请求来了！')
    const urlObj = url.parse(req.url as string)
    console.log('请求地址', urlObj)
    console.log('请求方法', req.method)
    console.log('请求头', req.headers)

    let body = '';
    req.on('data', (chunk: Buffer) => {
        body += chunk.toString('utf-8');
    })
    req.on('end', () => {
        console.log('请求体', body)
    })

    res.setHeader('foo', 'FOO')
    res.setHeader('bar', 'BAR')
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.write('Hello !!!')
    res.end();
})

server.listen(9527);

server.on('listening', () => {
    console.log('server listen 9527')
})