import fs from 'fs'
import path from 'path'

const filename = path.resolve(__dirname, '../myFiles/writeStream.txt');

const ws = fs.createWriteStream(filename, {
    encoding: 'utf-8',
    highWaterMark: 3,// 一次能写入的字节数，与编码无关系
})

// 解决写入磁盘时的背压问题

let i = 0;// 表示现在写到多少了
// 写入1兆，一直写，直到到达上限，或无法再直接写入
function write() {
    let flag = true;
    while (i < 1024 * 1024 && flag) {
        flag = ws.write('a');
        i++;
    }
}

write();

ws.on('drain', () => {
    write();
})