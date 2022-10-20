import Router from '@koa/router'
import { ParameterizedContext } from 'koa'
import QRCode from 'qrcode'
import jimp from 'jimp'
import { getSuccess, getError } from '../getSendResult'

/**
 * 二维码
 */

const router = new Router({
    prefix: '/api/qrcode'
})

router.post('/', async (ctx: ParameterizedContext) => {
    const str = ctx.request.body.str;
    if(str){
        try {
            const result = await QRCode.toDataURL(str);
            ctx.body = getSuccess({ result })
        } catch (error) {
            ctx.body = getError('请求体参数为空', 10020)
        }
    }else{
        ctx.body = getError('请求体参数为空', 10020)
    }
})

export default router.routes()