import fs from 'fs'
import path from 'path'

export async function copyStream() {
    const from = path.resolve(__dirname, '../myFiles/readStream.txt');
    const to = path.resolve(__dirname, '../myFiles/copyStream.txt');

    const rs = fs.createReadStream(from)
    const ws = fs.createWriteStream(to)

    rs.on('data', (chunk) => {
        let flag = ws.write(chunk);
        if(!flag){// 表示下一次写入，会造成背压
            rs.pause();// 暂停
        }
    })

    ws.on('drain', () => {// 可以继续写了
        rs.resume();// 继续读取
    })

    rs.on('close', () => {
        ws.end();
        console.log('复制完毕')
    })
}

export async function copyPipe(){
    const from = path.resolve(__dirname, '../myFiles/readStream.txt');
    const to = path.resolve(__dirname, '../myFiles/copyPipe.txt');

    const rs = fs.createReadStream(from)
    const ws = fs.createWriteStream(to)

    rs.pipe(ws);

    rs.on('close', () => {
        console.log('复制完毕，pipe方式')
    })
}