import { ParameterizedContext, Next } from 'koa'

/**
 * 允许访问 /a 的时候显示index.html
 */
export default async function (ctx: ParameterizedContext, next: Next) {
    if(
        ctx.method === 'GET' &&
        ctx.headers.accept?.includes('text/html') &&
        !ctx.path.includes('.')
    ){
        ctx.path = '/index.html';
    }
    await next();
}