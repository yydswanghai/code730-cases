import express from 'express'
import { asyncHandler } from '../getSendResult'
import { login } from '../../services/adminService'

const router = express.Router()

router.get('/login',
    asyncHandler(async (req, res) => {
        const { loginId, loginPwd } = req.body;
        const result = await login({ loginId, loginPwd });
        if(result){
            // 登录成功
            res.header('set-cookie', `token=${result.id}; path=/; domain=localhost; max-age=3600; httponly=true`)
        }
        return result;
    })
)

export default router