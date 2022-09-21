import express from 'express'
import { resolve } from 'path'

/**
 * 下载相关的headers
 * Content-Disposition: attachment
 * 指示如何处理响应内容: 以附件形式下载
 * Accept-Ranges: bytes
 * 是否支持断点续传，使用字节数，null为不支持
 */
const router = express.Router();
// 下载文件直接使用 res里面的 download(文件绝对路径, 文件下载保存至本地的名称, callback错误处理)
router.get('/:filename', (req, res) => {
    const absPath = resolve(__dirname, '../../resources', req.params.filename)
    res.download(absPath, req.params.filename)
})

/**
 * 断点续传
 * 例如在请求头里如果有：Range: bytes=1310720-1512672
 * 说明这里仅下载规定的范围内的字节
 * 可以在 const absPath 处添加一个断电，然后使用迅雷下载查看具体的断点续传操作
 * download()默认是支持断点续传
 */

/**
 * HEAD请求 在语意上和 GET请求 相同，意思是得到一个 GET请求 的消息头
 */

export default router