import fs from 'fs'
import path from 'path'

const filename = path.resolve(__dirname, '../myFiles/readStream.txt');

const rs = fs.createReadStream(filename, {
    encoding: 'utf-8',// utf-8表示以字符为单位读，null表示以字节为单位
    highWaterMark: 1, // utf-8每次读一个字符，与编码有关系
    autoClose: true   // 读完后会自动关闭，默认为true
})

rs.on('open', () => {
    console.log('文件被打开了')
})
rs.on('error', () => {
    console.log('出错了！！')// 例如读取的文件不存在
})
rs.on('close', () => {
    console.log('文件关闭了')
})

rs.on('data', (chunk) => {
    console.log('读到一部分数据：'+chunk)
    rs.pause();
})
rs.on('pause', () => {
    console.log('暂停了')
    setTimeout(() => {
        rs.resume();
    }, 1000);
})
rs.on('resume', () => {
    console.log('恢复了')
})

rs.on('end', () => {
    console.log("全部数据读取完毕");
})