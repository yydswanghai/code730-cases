import Router from '@koa/router'
import { Next, ParameterizedContext } from 'koa'
import multer from '@koa/multer'
import { resolve, extname } from 'path'
import { getSuccess, getError } from '../getSendResult'

/**
 * 上传
 */

const router = new Router({
    prefix: '/api'
})
// 磁盘存储引擎可以让你控制文件的存储
const storage = multer.diskStorage({
    // 是用来确定上传的文件应该存储在哪个文件夹中
    destination: function (res, file, cb) {// 这种方式需要手动自己添加文件目录
        cb(null, resolve(__dirname, '../../../public/upload/'))
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
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter(req, file, cb){
        // 验证文件后缀名
        const extName = extname(file.originalname);
        const whiteList = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
        if(whiteList.includes(extName)){
            cb(null, true);
        }else{
            cb(new Error(`不支持 ${extName} 后缀名，来上传文件`))
        }
    }
});

router.post('/upload', async (ctx: ParameterizedContext, next: Next) => {
    const err = await upload.single('image-single')(ctx, next)
                .then(res => res)
                .catch(err => err)

    if(err){
        console.error(err)
        ctx.body = getError('上传文件出错', 1004)
    }else{
        const url= `http://localhost:9525/upload/${ctx.file.filename}`
        ctx.body = getSuccess({ url })
    }
})

router.post('/uploads', async (ctx: ParameterizedContext, next: Next) => {
    const err = await upload.fields([{ name: 'image-multiple'}, { name: 'image-other' }])(ctx, next)
                .then(res => res)
                .catch(err => err)

    if(err){
        console.error(err)
        ctx.body = getError('上传文件出错', 1004)
    }else{
        const files: any = [];
        ctx.files['image-multiple'].forEach(item => {
            files.push({
                filename: item.filename,
                url: `http://localhost:9525/upload/${item.filename}`
            })
        })
        ctx.body = getSuccess(files)
    }
})

export default router.routes()
