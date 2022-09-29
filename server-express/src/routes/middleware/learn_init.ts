import express from 'express'
import { resolve } from 'path'
import myurlencoded from './learn_myUrlencoded'

const app = express();// 创建一个express应用

/**
 * 下面这段代码的作用：
 * 当请求时，会根据请求路径(req.path)，从指定的目录中寻找是否存在该文件，如果存在，直接响应文件内容，而不再移交给后续的中间件
 * 如果不存在文件，则直接移交给后续的中间件处理
 * 默认情况下，如果映射的结果是一个目录，则会自动使用index.html文件
 */
app.use(express.static(resolve(__dirname, '../public')));
/**
 * express.static中间件原理
 * 例如我请求该url: /static/css/index.css
 * req.baseUrl => /static
 * req.path => /css/index.css
 */
// app.use('/static', (req, res) => {
//     console.log(req.baseUrl, res.path)
// })
/**
 * express.urlencoded中间件，用来解析x-www-form-urlencoded
 */
app.use(express.urlencoded({ extended: true }))
/**
 * 自定义express.urlencoded中间件
 */
app.use(myurlencoded)
/**
 * 解析json中间件
 */
app.use(express.json())

app.post('/api/student', (req, res, next) => {
    console.log(req.body)
    next()
})

const port = 9525;
app.listen(port, () => {
    console.log(`server listen on ${port}`)
})