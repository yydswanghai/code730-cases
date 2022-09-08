import fs from 'fs'
import path from 'path'

// 注意路径前一般加三__dirname，因为fs是针对的当前cwd窗口
// 读取 => 回调
export function readCallback() {
    fs.readFile(path.resolve(__dirname, '../myFiles/1.txt'),
        'utf-8',
        (err, content) => {
            console.log(content)
        }
    )
}

// 读取 => promise
export async function read() {
    const filename = path.resolve(__dirname, '../myFiles/1.txt')
    const content = await fs.promises.readFile(filename, 'utf-8')
    console.log(content)
}

// 写入
export async function write() {
    const filename = path.resolve(__dirname, '../myFiles/1.txt')
    await fs.promises.writeFile(filename, 'def', {
        flag: 'a'// 追加
    })
    console.log('写入成功')
}

// 复制
export async function copy() {
    const filename = path.resolve(__dirname, '../myFiles/img.jpg')
    const buffer = await fs.promises.readFile(filename)
    const toFilename = path.resolve(__dirname, '../myFiles/img_copy.jpg')
    await fs.promises.writeFile(toFilename, buffer)
    console.log('复制成功')
}

// stat
export async function state() {
    const filename = path.resolve(__dirname, './myFiles/img.jpg')
    const stat = await fs.promises.stat(filename)
    console.log(stat)
}

// 读取目录
export async function readDir() {
    const dirname = path.resolve(__dirname, '../myFiles')
    const paths = await fs.promises.readdir(dirname)
    console.log(paths)
}

// 创建目录
export async function mkDir() {
    const dirname = path.resolve(__dirname, '../myFiles/1')
    await fs.promises.mkdir(dirname)
    console.log('创建目录成功')
}

// 判断文件是否存在
async function exists(filename) {
    try {
        await fs.promises.stat(filename);
        return true;
    } catch (err) {
        if(err.code === 'ENOENT'){
            return false;// 文件不存在
        }
        throw err;
    }
}
// myFiles目录下是否有3这个文件
export async function isfs() {
    const dirname = path.resolve(__dirname, '../myFiles/3')
    await exists(dirname)
}

// 删除文件
export async function unlink() {
    const filename = path.resolve(__dirname, '../myFiles/img_copy.jpg')
    await fs.promises.unlink(filename);
    console.log('删除文件成功')
}

// 删除目录
export async function rmdir() {
    const dirname = path.resolve(__dirname, '../myFiles/1')
    await fs.promises.rmdir(dirname)
    console.log('删除目录成功')
}