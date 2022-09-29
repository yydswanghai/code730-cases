import express from 'express'
import { asyncHandler } from '../getSendResult'
import { getAdminById, login } from '../../services/adminService'
import { jwtPublish } from '../middleware/jwt'
import { encrypt } from '../../utils/crypt'

const router = express.Router()

router.get('/whoami',
    asyncHandler(async (req, res) => {
        return await getAdminById(req.userId);
    })
)

// 默认使用jwt登录
router.post('/login',
    asyncHandler(async (req, res) => {
        const { loginId, loginPwd } = req.body;
        const result = await login({ loginId, loginPwd });
        if(result){// 登录成功
            jwtPublish(res, { id: result.id });
        }
        return result;
    })
)

// 使用cookie登录
router.post('/login4cookie',
    asyncHandler(async (req, res) => {
        const { loginId, loginPwd } = req.body;
        const result = await login({ loginId, loginPwd });
        if(result){
            // 登录成功
            const value = encrypt(result.id.toString())// 加密
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

// 使用session登录
router.post('/login4session',
    asyncHandler(async (req, res) => {
        const { loginId, loginPwd } = req.body;
        const result = await login({ loginId, loginPwd });
        if(result){
            const value = encrypt(result.id.toString())// 加密
            req.session.userId = value;// 保存session
        }
        return result;
    })
)

export default router