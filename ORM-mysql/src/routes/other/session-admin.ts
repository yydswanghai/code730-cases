import express from 'express'
import { asyncHandler } from '../getSendResult'
import { login } from '../../services/adminService'
import { encrypt } from '../../utils/crypt'

const router = express.Router()

/**
 * 使用session验证
 */

router.post('/login',
    asyncHandler(async (req, res) => {
        const { loginId, loginPwd } = req.body;
        const result = await login({ loginId, loginPwd });
        if(result){
            // 登录成功
            let value = result.id;
            value = encrypt(value.toString())// 加密
            req.session.loginUser = result;// 保存session
        }
        return result;
    })
)

export default router