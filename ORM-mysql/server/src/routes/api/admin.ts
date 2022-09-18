import express from 'express'
import { asyncHandler } from '../getSendResult'
import { getAdminById, login } from '../../services/adminService'
import { jwtPublish } from '../jwt'

const router = express.Router()

router.post('/login',
    asyncHandler(async (req, res) => {
        const { loginId, loginPwd } = req.body;
        const result = await login({ loginId, loginPwd });
        if(result){
            let value = result.id;
            // 登录成功
            jwtPublish(res, { id: value });
        }
        return result;
    })
)

router.get('/whoami',
    asyncHandler(async (req, res) => {
        return await getAdminById(req.userId);
    })
)


export default router