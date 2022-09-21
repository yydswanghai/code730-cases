import express from 'express'
import multer from 'multer'
import { resolve, extname } from 'path'
/**
 * multer 中间件建议只在对应的路由里使用，不要在全局挂载
 */
const router = express.Router();

const storage = multer.diskStorage({// 磁盘存储引擎可以让你控制文件的存储
    // 是用来确定上传的文件应该存储在哪个文件夹中
    destination: function (res, file, cb) {
        cb(null, resolve(__dirname, '../../public/upload'))
    },
    // 用于确定文件夹中的文件名的确定
    filename: function (req, file, cb) {
        const tempStamp = Date.now();
        const randomStr = Math.random().toString(36).slice(-6);
        const ext = extname(file.originalname);
        const filename = `${tempStamp}-${randomStr}${ext}`
        cb(null, filename)
    }
})

const upload = multer({
    storage,
    limits: { fileSize: 1024 * 100 },
    fileFilter(req, file, cb){
        // 验证文件后缀名
        const extName = extname(file.originalname);
        const whiteList = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
        if(whiteList.includes(extName)){
            cb(null, true);
        }else{
            cb(new Error(`不支持 ${extName} 后缀名，来上传文件`))
        }
    }
})

router.post('/', upload.single('img'), (req, res) => {
    const url = `/upload/${req.file.filename}`
    res.send({
        code: 0,
        msg: '上传成功',
        data: url
    })
})

export default router