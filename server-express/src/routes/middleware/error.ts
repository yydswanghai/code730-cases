/**
 * 处理错误中间件
 */
import { getError } from '../getSendResult'
import multer from 'multer'

export default function (err, req, res, next) {
    if(err){
        // 文件上传错误
        if(err instanceof multer.MulterError){
            res.status(200).send(getError(err.message))
            return;
        }
        const message: string = err instanceof Error ? err.message : err
        // 发生了错误
        res.status(500).send(getError(message))
    }else{
        next();
    }
}