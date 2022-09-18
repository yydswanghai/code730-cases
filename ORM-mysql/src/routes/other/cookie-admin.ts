import express from 'express'
import { asyncHandler } from '../getSendResult'
import { login } from '../../services/adminService'
import { encrypt } from '../../utils/crypt'

const router = express.Router()

/**
 * 使用cookie验证
 */

router.post('/login',
    asyncHandler(async (req, res) => {
        const { loginId, loginPwd } = req.body;
        const result = await login({ loginId, loginPwd });
        if(result){
            // 登录成功
            let value = result.id;
            value = encrypt(value.toString())// 加密
            // 1. 直接设置
            // res.header('set-cookie', `token=${result.id}; path=/; domain=localhost; max-age=3600; httponly=true`)
            // 2. 使用第三方库 cookie-parser 设置
            res.cookie('token', value, {
                path: '/',
                domain: 'localhost',
                maxAge: 7*24*3600*1000,
                httpOnly: true
            });
            // 如果请求的对象不是浏览器
            res.header('authorization', value);
        }
        return result;
    })
)

export default router