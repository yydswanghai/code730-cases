import express from 'express'
import { asyncHandler } from '../getSendResult'
import { getAdminById, login } from '../../services/adminService'
import { jwtPublish } from '../jwt'

const router = express.Router()

// 自定义错误
export class AdminError extends Error {
    constructor(msg: string){
        super(msg)
        // 设置原型
        Object.setPrototypeOf(this, AdminError.prototype)
    }
}

router.post('/login',
    asyncHandler(async (req, res) => {
        const { loginId, loginPwd } = req.body;
        if(!loginId || !loginPwd){
            throw new AdminError('没有传递loginId或loginPwd')
        }
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