import Router from '@koa/router'
import { ParameterizedContext } from 'koa'
import { login, getAdminById } from '../../services/adminService'
import { getSuccess, getError } from '../getSendResult'
import { encrypt } from '../../utils/crypt'
import { jwtPublish } from '../middleware/jwt'

const router = new Router({
    prefix: '/api/admin'
})

router.get('/whoami', async (ctx) => {
    const id: number = ctx.state.userId || -1;
    const result = await getAdminById(id)
    if(result){
        ctx.body = getSuccess(result);
    }else{
        ctx.body = getError();
    }
})

// 默认使用jwt登录
router.post('/login', async (ctx: ParameterizedContext) => {
    const result = await login(ctx.request.body);
    if(result){// 登录成功
        jwtPublish(ctx, { id: result.id });
        ctx.body = getSuccess(result);
    }else{// 登录失败
        ctx.body = getError('登录失败', 1002);
    }
})

// 使用cookie登录
router.post('/login4cookie', async (ctx: ParameterizedContext) => {
    const result = await login(ctx.request.body);
    if(result){// 登录成功
        const value = encrypt(result.id.toString());// 加密
        ctx.cookies.set('token', value, {
            path: '/',
            domain: 'localhost',
            maxAge: 7*24*3600*1000,
            httpOnly: true,
            signed: false,
        })
        ctx.set('authorization', value);// 如果用户不是使用浏览器
        ctx.body = getSuccess(result);
    }else{// 登录失败
        ctx.body = getError('登录失败', 1002);
    }
})

// 使用session登录
router.post('/login4session', async (ctx: ParameterizedContext) => {
    const result = await login(ctx.request.body);
    if(result){// 登录成功
        const value = encrypt(result.id.toString());// 加密
        ctx.session.userId = value;
        ctx.body = getSuccess(result);
    }else{// 登录失败
        ctx.body = getError('登录失败', 1002);
    }
})

export default router.routes()