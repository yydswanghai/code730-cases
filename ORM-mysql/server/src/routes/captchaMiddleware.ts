import express from 'express'
import svgCaptcha from 'svg-captcha'
/**
 * 验证码
 */
const router = express.Router()

router.get('/captcha', (req, res) => {
    const captcha = svgCaptcha.create({
        size: 6,
        ignoreChars: 'iIlLoO',
        noise: 6,
        color: true
    })
    // 把验证码中的文本存放到session中
    req.session.captcha = captcha.text.toLowerCase();

    // console.log(req.session)

    res.type('svg');
    res.status(200).send(captcha.data);
})

function captchaHandler(req, res, next) {
    if(!req.session.records){
        // 如果session总没有访问记录
        req.session.records = [];
    }
    const now = new Date().getTime();
    req.session.records.push(now);// 讲这次请求的访问时间记录下来

    // 如果在一小段时间内请求达到了一定的数量，就可能是机器
    const duration = 1000 * 10;
    const repeat = 3;

    req.session.records = req.session.records.filter(
        (time) => now - time <= duration
    );

    // 一小段时间内请求大于repeat次 或 请求体里有 captcha 字段
    if(req.session.records.length >= repeat || 'captcha' in req.body){
        // 验证验证码
        validateCaptcha(req, res, next);
    }else{
        next();
    }
}

function validateCaptcha(req, res, next) {
    const reqCaptcha = req.body?.captcha?.toLowerCase();//用户传递的验证码

    if(reqCaptcha !== req.session.captcha){
        // 验证码有问题
        res.send({
            code: 401,
            msg: '验证码有问题'
        })
    }else{
        next();
    }
}

router.post('*', captchaHandler)
router.put('*', captchaHandler)

export default router