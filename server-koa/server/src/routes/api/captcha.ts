import Router from '@koa/router'
import { ParameterizedContext } from 'koa'
import svgCaptcha from 'svg-captcha'

/**
 * 验证码
 */

const router = new Router({
    prefix: '/api/captcha'
})

router.get('/', async (ctx: ParameterizedContext) => {
    const captcha = svgCaptcha.create({
        size: 6,
        ignoreChars: 'iTlLoO',
        noise: 6,
        color: true,
    })
    // 把验证码中的文本存放到session中
    ctx.session.captcha = captcha.text.toLowerCase();
    console.log(ctx.session)

    ctx.response.type = 'image/svg+xml';
    ctx.body = captcha.data
})

export default router.routes()