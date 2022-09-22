import express from 'express'
import { resolve } from 'path'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import studentRouter from './api/student'
import adminRouter from './api/admin'
import uploadRouter from './api/upload'
import downloadRouter from './api/download'
import qrcodeRouter from './api/qrcode'
import errorMiddleware from './errorMiddleware'
import tokenMiddleware from './tokenMiddleware'
import apiLogMiddleware from './apiLogMiddleware'
import imgProtectMiddleware from './imgProtectMiddleware'
import proxyMiddleware from './proxyMiddleware'

// 创建一个express应用
const app = express();

app.use(imgProtectMiddleware);

const whiteList = ['null', 'http://localhost:9525', 'http://localhost:8808']
app.use(cors({
    origin(origin, callback){
        // if(!origin){
        //     callback(null, '*');
        //     return;
        // }
        // callback(null, origin);
        if(whiteList.includes(origin) || !origin){
            callback(null, origin);
        }else{
            callback(new Error('不在白名单内 not allowed'));
        }
    },
    credentials: true
}));

// 映射public目录中的静态资源
app.use(express.static(resolve(__dirname, '../public')));
app.use(cookieParser());
app.use(tokenMiddleware);
// 解析 application/x-www-form-urlencoded 格式的请求体
app.use(express.urlencoded({ extended: true }));
// 解析 application/json 格式的请求体
app.use(express.json());

app.use(proxyMiddleware)
app.use(apiLogMiddleware)
// 处理 api 的请求
app.use('/api/student', studentRouter);
app.use('/api/admin', adminRouter);
app.use('/api/upload', uploadRouter);
app.use('/download', downloadRouter)
app.use('/api/qrcode', qrcodeRouter)

// 处理错误的中间件
app.use(errorMiddleware);

const port = 9525;
app.listen(port, () => {
    console.log(`server listen on ${port}`)
})