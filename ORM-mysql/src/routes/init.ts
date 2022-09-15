import express from 'express'
import { resolve } from 'path'
import cookieParser from 'cookie-parser'
import studentRouter from './api/student'
import adminRouter from './api/admin'
import errorMiddleware from './errorMiddleware'
import tokenMiddleware from './tokenMiddleware'

// 创建一个express应用
const app = express();
app.use(cookieParser());
app.use(tokenMiddleware)
// 映射public目录中的静态资源
app.use(express.static(resolve(__dirname, '../public')));
// 解析 application/x-www-form-urlencoded 格式的请求体
app.use(express.urlencoded({ extended: true }));
// 解析 application/json 格式的请求体
app.use(express.json());
// 处理 api 的请求
app.use('/api/student', studentRouter);
app.use('/api/admin', adminRouter);

// 处理错误的中间件
app.use(errorMiddleware);

const port = 9525;
app.listen(port, () => {
    console.log(`server listen on ${port}`)
})