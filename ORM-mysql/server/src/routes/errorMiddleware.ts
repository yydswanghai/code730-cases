/**
 * 处理错误中间件
 */
import { getError } from './getSendResult'

export default function (err, req, res, next) {
    if(err){
        const message: string = err instanceof Error ? err.message : err
        // 发生了错误
        res.status(500).send(getError(message))
    }else{
        next();
    }
}