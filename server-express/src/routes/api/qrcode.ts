import express from 'express'
import QRCode from 'qrcode'
import jimp from 'jimp'
import { resolve } from 'path'
/**
 * 服务端生成二维码
 */
const router = express.Router();

router.post('/', (req, res) => {
    if(req.body.str){
        QRCode.toDataURL(req.body.str)
        .then(url => {
            res.send({
                code: 0,
                msg: '',
                data: url
            })
        })
        .catch(err => {
            console.log(err);
        })
    }else{
        res.send({
            code: 10020,
            msg: '请求体参数为空',
            data: ''
        })
    }
})

/**
 * 添加中间logo水印
 * @param waterFile 水印图
 * @param originFile 原图
 * @param targetPath 生成后的水印图放置的目标路径
 * @param proportion 水印图以原图为基础缩小多少倍显示
 */
async function mark(waterFile, originFile, targetPath, proportion = 5) {
    const [water, origin] = await Promise.all([
        jimp.read(waterFile),
        jimp.read(originFile),
    ])

    // 对水印图片进行缩放
    const scale = (origin.bitmap.width / proportion) / water.bitmap.width;
    water.scale(scale);

    // 计算位置
    const x = (origin.bitmap.width - (origin.bitmap.width / proportion)) /2;
    const y = (origin.bitmap.height - (origin.bitmap.height / proportion)) /2;

    // 写入水印
    origin.composite(water, x, y, {
        mode: jimp.BLEND_SOURCE_OVER,
        opacitySource: 1,
        opacityDest: 1
    })
    const jimpObj = await origin.write(targetPath)

    try {
        return await jimpObj.getBase64Async(jimp.MIME_PNG)
    } catch (err) {
        console.log(err)
        return null;
    }
}

router.post('/diy', async (req, res) => {
    if(req.body.str){
        const tempStamp = Date.now().toString().slice(-6);
        const randomStr = Math.random().toString(36).slice(-6);
        const filename = `${tempStamp}-${randomStr}.png`

        const water = resolve(__dirname, '../../public/img/qrcode-water.jpeg');
        const newPath = resolve(__dirname, `../../public/upload/${filename}`);
        const outFilePath = resolve(__dirname, `../../public/qrimg/${filename}`)

        await QRCode.toFile(outFilePath, req.body.str)
        const result: any = await mark(water, outFilePath, newPath)
        res.send({
            code: 0,
            msg: '',
            data: result
        })
    }else{
        res.send({
            code: 10020,
            msg: '请求体参数为空',
            data: ''
        })
    }
})

export default router