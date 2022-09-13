import express from 'express'
import staticMiddleware from './staticMiddleware'

const app = express();// 创建一个express应用

app.use(staticMiddleware)

app.get('/news/abc', (req, res, next) => {
    console.log('handle1')
    next()
})

const port = 9525;
app.listen(port, () => {
    console.log(`server listen on ${port}`)
})