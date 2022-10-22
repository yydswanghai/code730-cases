import express from 'express'
import { resolve } from 'path'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import studentRouter from './api/student'
import adminRouter from './api/admin'
import uploadRouter from './api/upload'
import downloadRouter from './api/download'
import qrcodeRouter from './api/qrcode'
import bookRouter from './api/book'
import errorMid from './middleware/error'
import tokenMid from './middleware/token4jwt'
import corsMid from './middleware/cors'
import apiLogMid from './middleware/apiLog'
import imgProtectMid from './middleware/imgProtect'
import proxyMid from './middleware/proxy'
import captchaMid from './api/captcha'

// 创建一个express应用
const app = express();

app.use(session({ secret: 'i-secret-for-wanghai', name: 'express-sess' }));
app.use(imgProtectMid);
app.use(corsMid);
// 映射public目录中的静态资源
app.use(express.static(resolve(__dirname, '../public'), {
    setHeaders(res, path: string){
        if(!path.endsWith('.html')){// 不缓存 html 文件
            res.header('Cache-Control', `max-age=${3600*24}`)
        }
    }
}));
app.use(cookieParser());
app.use(tokenMid);
app.use(express.urlencoded({ extended: true }));// 解析请求体 格式: application/x-www-form-urlencoded
app.use(express.json());// 解析请求体 格式: application/json
app.use(proxyMid);
app.use(apiLogMid);
app.use(captchaMid);
// 处理 api 的请求
app.use('/api/student', studentRouter);
app.use('/api/admin', adminRouter);
app.use('/api/upload', uploadRouter);
app.use('/download', downloadRouter);
app.use('/api/qrcode', qrcodeRouter);
app.use('/api/book', bookRouter);
// 处理错误的中间件
app.use(errorMid);

const port = 9525;
app.listen(port, () => console.log(`server listen on ${port}`))