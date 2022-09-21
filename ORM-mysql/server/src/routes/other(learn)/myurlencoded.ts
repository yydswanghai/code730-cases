import { parse } from 'querystring'
/**
 * 自定义urlencoded中间件 原理
 */
export default function (req, res, next) {
    if(req.headers['content-type'] === 'application/x-www-form-urlencoded'){
        // 自行解析消息体
        let result = '';
        req.on('data', (chunk: Buffer) => {
            result += chunk.toString('utf-8');
        })
        req.on('end', () => {
            req.body = parse(result);
            next();
        })
    }else{
        next();
    }
}