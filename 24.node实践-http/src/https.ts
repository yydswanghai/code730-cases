import https from 'https'
import URL from 'url'
import path from 'path'
import fs from 'fs'
/**
 * 静态资源服务器
 */
async function handler(req, res) {
    const info = await getFileInfo(req.url as string)
    if(info){
        res.write(info)
    }else{
        res.statusCode = 404
        res.write(`<!DOCTYPE html>
        <html lang=en>
        <head>
            <meta charset=utf-8>
            <meta http-equiv=X-UA-Compatible content="IE=edge">
            <meta name=viewport content="width=device-width,initial-scale=1">
            <title>404</title>
        </head>
        <body>
            <h3>找不到资源</h3>
        </body>
        </html>`)
    }
    res.end()
}
// 得到要处理的文件内容
async function getFileInfo(url: string) {
    const urlObj = URL.parse(url)
    // 要处理的文件路径
    let filename = path.resolve(__dirname, '../public/', (urlObj.pathname as string).substring(1))
    let stat = await getStat(filename)// 文件状态
    if(!stat){
        // 文件不存在
        console.log('文件不存在')
        return null;
    }else if(stat.isDirectory()){
        // 文件是一个目录
        filename = path.resolve(__dirname, '../public/', (urlObj.pathname as string).substring(1), 'index.html')
        stat = await getStat(filename)
        if(!stat){
            console.log('目录下的文件依然不存在')
            return null;
        }else{
            return await fs.promises.readFile(filename)
        }
    }else{
        return await fs.promises.readFile(filename)
    }
}
async function getStat(filename: fs.PathLike) {
    try {
        return await fs.promises.stat(filename)
    } catch (error) {
        return null;
    }
}

const server = https.createServer({
    key: fs.readFileSync(path.resolve(__dirname, '../ca/localhost+2-key.pem')),
    cert: fs.readFileSync(path.resolve(__dirname, '../ca/localhost+2.pem'))
},handler)

server.on('listening', () => {
    console.log('server listen 9526')
})

server.listen(9526)