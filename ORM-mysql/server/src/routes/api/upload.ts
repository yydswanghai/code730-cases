import express from 'express'
import multer from 'multer'
import { resolve, extname } from 'path'
import jimp from 'jimp'
/**
 * multer 中间件建议只在对应的路由里使用，不要在全局挂载
 */
const router = express.Router();

const storage = multer.diskStorage({// 磁盘存储引擎可以让你控制文件的存储
    // 是用来确定上传的文件应该存储在哪个文件夹中
    destination: function (res, file, cb) {// 这种方式需要手动自己添加文件目录
        cb(null, resolve(__dirname, '../../public/origin'))
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
    limits: { fileSize: 1024 * 1024 },
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
})
// 这里 img 与前端上传附件的 name="img" 对应
router.post('/', upload.single('img'), (req, res) => {
    const url = `/upload/${req.file.filename}`
    res.send({
        code: 0,
        msg: '上传成功',
        data: url
    })
})

/**
 * 加水印
 * @param waterFile 水印图
 * @param originFile 原图
 * @param targetPath 生成后的水印图放置的目标路径
 * @param proportion 水印图以原图为基础缩小多少倍显示
 */
async function mark(waterFile, originFile, targetPath, proportion = 5, marginProportion = 0.01) {
    const [water, origin] = await Promise.all([
        jimp.read(waterFile),
        jimp.read(originFile),
    ])

    // 对水印图片进行缩放
    const scale = (origin.bitmap.width / proportion) / water.bitmap.width;
    water.scale(scale);

    // 计算位置
    const right = origin.bitmap.width * marginProportion;// 距离右下角右边的距离
    const bottom = origin.bitmap.height * marginProportion;// 距离右下角下边的距离
    const x = origin.bitmap.width - right - water.bitmap.width;
    const y = origin.bitmap.height - bottom - water.bitmap.height;

    // 写入水印
    origin.composite(water, x, y, {
        mode: jimp.BLEND_SOURCE_OVER,
        opacitySource: 0.3,
        opacityDest: 1
    })

    await origin.write(targetPath)
}

/**
 * 图片添加水印
 */
router.post('/water', upload.single('waterimg'), async (req, res) => {
    const url = `/upload/${req.file.filename}`;
    const newPath = resolve(__dirname, '../../public/upload/', req.file.filename);
    const waterPath = resolve(__dirname, '../../public/img/water.jpeg');
    await mark(waterPath, req.file.path, newPath);
    res.send({
        code: 0,
        msg: '',
        data: url
    })
})

export default router