import Router from '@koa/router'
import { ParameterizedContext } from 'koa'
import { login } from '../../services/adminService'

// 自定义错误
export class AdminError extends Error {
    constructor(msg: string){
        super(msg)
        // 设置原型
        Object.setPrototypeOf(this, AdminError.prototype)
    }
}

const router = new Router({
    prefix: '/api/admin'
})

router.post('/login', async (ctx: ParameterizedContext) => {

    const result = await login(ctx.request.body);
    if(result){
        
    }else{// null 登录失败
        ctx.body = {
            code: 1002,
            msg: '登录失败'
        }
    }
})

router.get('/whoami', (ctx) => {
    ctx.body = '<h1>你好</h1>'
})

export default router.routes()